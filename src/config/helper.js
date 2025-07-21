import {
  PERMIT2_ADDRESS,
  AllowanceTransfer,
} from "@uniswap/permit2-sdk";

import axios from "axios";
import qs from "qs";

import { BigNumber, Contract, Signer } from "ethers";

import { ethers } from 'ethers';

import { PORTFOLIO_ABI, IAllowanceTransfer, POSITION_WRAPPER_ABI, PORTFOLIO_CALCULATIONS_ABI, ERC20_ABI, AMOUNT_CALCULATIONS_ALGEBRA_ABI, tokenBalanceLibraryAddress, ASSET_MANAGEMENT_CONFIG_ABI, POSITION_MANAGER_ALGEBRA_ABI, EXTERNAL_POSITION_STORAGE_ABI, PRICE_ORACLE_ABI } from "./contracts";

const MaxUint128 = ethers.BigNumber.from("0xffffffffffffffffffffffffffffffff");

const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);


// Constants
const CHAIN_ID = 56;
const SLIPPAGE = 700;
const FEE_TIER = "100";
const BASIS_POINTS = 999;
const DIVISOR = 1000;
const SAFETY_WEI = ethers.BigNumber.from(1);
const SCALE = BigNumber.from("1000000000000000000"); // 1e18

export function toDeadline(expiration) {
  return Math.floor((Date.now() + expiration) / 1000);
}

// DEPOSIT

// Returns the EIP-2612 permit signature for multi-token deposits into a portfolio.
export async function getPermitSignature(
  tokenBalanceLibraryAddress,
  portfolioAddress,
  amounts,
  depositor,
  chainId
) {
  const portfolio = new ethers.Contract(portfolioAddress, PORTFOLIO_ABI, depositor);
  const tokens = await portfolio.getTokens();

  // Get permit2 contract
  const permit2 = new ethers.Contract(PERMIT2_ADDRESS, IAllowanceTransfer, depositor);

  // Create token details
  let tokenDetails = [];
  for (let i = 0; i < tokens.length; i++) {
    let { nonce } = await permit2.allowance(
      depositor.address,
      tokens[i],
      portfolioAddress
    );

    let detail = {
      token: tokens[i],
      amount: amounts[i],
      expiration: toDeadline(/* 30 days= */ 1000 * 60 * 60 * 24 * 30),
      nonce,
    };
    tokenDetails.push(detail);
  }

  // Create permit batch
  const permit = {
    details: tokenDetails,
    spender: portfolioAddress,
    sigDeadline: toDeadline(/* 30 minutes= */ 1000 * 60 * 60 * 30),
  };

  const { domain, types, values } = AllowanceTransfer.getPermitData(
    permit,
    PERMIT2_ADDRESS,
    chainId
  );

  // Get signature and return it
  return await depositor._signTypedData(domain, types, values);
}

async function getDepositAmounts(
  portfolio,
  tokens,
  depositAmount,
  priceOracleAddress,
  amountCalculationsAddress,
  reinvestmentSwapInfo
) {
  const numTokens = tokens.length;
  const totalSupply = await portfolio.totalSupply();
  let splitAmounts = [];

  // Get vault address
  const vaultAddress = await portfolio.vault();

  if (totalSupply.eq(0)) {
    // Split equally
    splitAmounts = splitEqually(BigNumber.from(depositAmount), numTokens);
  } else {
    let usdBalances = [];
    let totalUsd = BigNumber.from(0);
    for (let i = 0; i < numTokens; i++) {
      const token = tokens[i];
      if (reinvestmentSwapInfo.isTokenExternalPosition[i]) {
        // For external positions, get underlying token amounts using calculateOutputAmounts with 100%

        const { token0Amount, token1Amount } = await calculateOutputAmounts(
          token,
          amountCalculationsAddress,
          "10000" // 100% in 1e18 precision
        );

        const positionWrapper = new ethers.Contract(token, POSITION_WRAPPER_ABI, provider);
        const token0 = await positionWrapper.token0();
        const token1 = await positionWrapper.token1();
        const usd0 = await getTokenUsdValue(
          token0,
          priceOracleAddress,
          token0Amount.toString()
        );
        const usd1 = await getTokenUsdValue(
          token1,
          priceOracleAddress,
          token1Amount.toString()
        );
        const usdSum = usd0.add(usd1);
        usdBalances.push(usdSum);
        totalUsd = totalUsd.add(usdSum);
      } else {
        const tokenContract = new ethers.Contract(token, ERC20_ABI, provider);
        const bal = await tokenContract.balanceOf(vaultAddress);

        const usd = await getTokenUsdValue(
          token,
          priceOracleAddress,
          bal.toString()
        );
        usdBalances.push(usd);
        totalUsd = totalUsd.add(usd);
      }
    }
    if (totalUsd.eq(0)) {
      // fallback to equal split if all USD values are zero
      splitAmounts = splitEqually(BigNumber.from(depositAmount), numTokens);
    } else {
      for (let i = 0; i < numTokens; i++) {
        let amount = BigNumber.from(depositAmount)
          .mul(usdBalances[i])
          .div(totalUsd);
        splitAmounts.push(amount.toString());
      }
    }
  }

  // Now, for each token, if it's an external position, split its amount into underlying tokens by getCurrentRatio
  let finalTokens = [];
  let finalAmounts = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const splitAmount = splitAmounts[i];
    if (reinvestmentSwapInfo.isTokenExternalPosition[i]) {
      const positionWrapper = new ethers.Contract(token, POSITION_WRAPPER_ABI, provider);
      const token0 = await positionWrapper.token0();
      const token1 = await positionWrapper.token1();
      const { amount0USD, amount1USD } = await getCurrentRatio(
        token,
        priceOracleAddress,
        amountCalculationsAddress
      );
      const totalUSD = amount0USD.add(amount1USD);
      if (totalUSD.eq(0)) {
        // fallback: split equally
        finalTokens.push(token0, token1);
        const splitAmountBN = BigNumber.from(splitAmount);
        finalAmounts.push(
          splitAmountBN.div(2).toString(),
          splitAmountBN.div(2).toString()
        );
      } else {
        const ratio0 = calculateRatio(amount0USD, totalUSD);
        const ratio1 = calculateRatio(amount1USD, totalUSD);
        finalTokens.push(token0, token1);
        finalAmounts.push(ratio0.toString(), ratio1.toString());
      }
    } else {
      finalTokens.push(token);
      finalAmounts.push(splitAmount);
    }
  }

  return { finalTokens, finalAmounts };
}

export async function createDepositBatchDataWithEnso(
  priceOracleAddress,
  tokenBalanceLibraryAddress,
  swapVerificationLibraryAddress,
  amountCalculationAddress,
  portfolioAddress,
  depositBatchAddress,
  depositToken,
  depositAmount // single amount
) {
  let reinvestmentSwapInfo = await getExternalPositionData(
    portfolioAddress,
    priceOracleAddress,
    tokenBalanceLibraryAddress,
    swapVerificationLibraryAddress,
    amountCalculationAddress
  );

  // Get tokens from portfolio
  const portfolio = new ethers.Contract(portfolioAddress, PORTFOLIO_ABI, provider);
  const tokens = await portfolio.getTokens();

  // Use helper to get split amounts
  let { finalTokens, finalAmounts } = await getDepositAmounts(
    portfolio,
    tokens,
    depositAmount,
    priceOracleAddress,
    amountCalculationAddress,
    reinvestmentSwapInfo
  );

  let ensoCalldata = await createEnsoCalldataDeposit(
    depositBatchAddress,
    depositToken,
    reinvestmentSwapInfo.swapTokens,
    finalAmounts
  );

  return { reinvestmentSwapInfo, ensoCalldata };
}

export async function createEnsoCalldataDeposit(
  depositBatchAddress,
  depositToken,
  swapTokens,
  depositAmounts
) {
  let postResponse = [];
  for (let i = 0; i < swapTokens.length; i++) {
    if (swapTokens[i] == depositToken) {
      const abiCoder = ethers.utils.defaultAbiCoder;
      const encodedata = abiCoder.encode(["uint"], [depositAmounts[i]]);
      postResponse.push(encodedata);
    } else {
      let response = await createEnsoCallDataRoute(
        depositBatchAddress,
        depositBatchAddress,
        depositToken,
        swapTokens[i],
        depositAmounts[i]
      );
      postResponse.push(response.data.tx.data);
    }
  }

  return postResponse;
}

// WITHDRAWAL

export async function getWithdrawBatchData(
  priceOracleAddress,
  tokenBalanceLibraryAddress,
  swapVerificationLibraryAddress,
  portfolioCalculationsAddress,
  amountCalculationsAddress,
  portfolioAddress,
  withdrawalToken,
  portfolioTokenWithdrawAmount,
  withdrawBatchAddress,
  userAddress
) {
  console.log({ userAddress })
  console.log("portfolioAddress", portfolioAddress);
  console.log("priceOracleAddress", priceOracleAddress);
  console.log("tokenBalanceLibraryAddress", tokenBalanceLibraryAddress);
  console.log("swapVerificationLibraryAddress", swapVerificationLibraryAddress);
  console.log("amountCalculationsAddress", amountCalculationsAddress);
  console.log("portfolioAddress", portfolioAddress);
  console.log("withdrawalToken", withdrawalToken);
  let reinvestmentSwapInfo = await getExternalPositionData(
    portfolioAddress,
    priceOracleAddress,
    tokenBalanceLibraryAddress,
    swapVerificationLibraryAddress,
    amountCalculationsAddress
  );

  let { withdrawalAmounts } = await getWithdrawalAmounts(
    tokenBalanceLibraryAddress,
    portfolioCalculationsAddress,
    portfolioAddress,
    portfolioTokenWithdrawAmount
  );

  let { swapAmounts } = await getSwapAmountsForExternalPosition(
    portfolioAddress,
    tokenBalanceLibraryAddress,
    amountCalculationsAddress,
    reinvestmentSwapInfo.isExternalPosition,
    reinvestmentSwapInfo.positionWrappers,
    withdrawalAmounts
  );

  let swapTokens = reinvestmentSwapInfo.swapTokens;
  console.log("swapTokens", swapTokens)

  let ensoCalldata = [];
  for (let i = 0; i < swapTokens.length; i++) {
    if (swapTokens[i] != withdrawalToken) {
      let response = await createEnsoCallDataRoute(
        withdrawBatchAddress,
        userAddress,
        swapTokens[i],
        withdrawalToken,
        BigNumber.from(swapAmounts[i]).toString()
      );
      console.log("response", response)
      ensoCalldata.push(response.data.tx.data);
    }
  }
  console.log("ensoCalldata", ensoCalldata)
  return { reinvestmentSwapInfo, ensoCalldata };
}

export async function getWithdrawalAmounts(
  tokenBalanceLibraryAddress,
  portfolioCalculationsAddress,
  portfolioAddress,
  portfolioTokenWithdrawAmount
) {
  const portfolioCalculations = new ethers.Contract(portfolioCalculationsAddress, PORTFOLIO_CALCULATIONS_ABI, provider);

  let withdrawalAmounts =
    await portfolioCalculations.callStatic.getWithdrawalAmounts(
      portfolioTokenWithdrawAmount,
      portfolioAddress
    );

  return { withdrawalAmounts };
}

export async function getSwapAmountsForExternalPosition(
  portfolioAddress,
  tokenBalanceLibraryAddress,
  amountCalculationsAddress,
  isTokenExternalPosition,
  positionWrappers,
  withdrawalAmounts
) {
  const portfolio = new ethers.Contract(portfolioAddress, PORTFOLIO_ABI, provider);
  const tokens = await portfolio.getTokens();

  let swapAmounts = [];
  let wrapperIndex = 0;

  const amountCalculationsAlgebra = new ethers.Contract(amountCalculationsAddress, AMOUNT_CALCULATIONS_ALGEBRA_ABI, provider);


  for (let i = 0; i < tokens.length; i++) {
    if (!isTokenExternalPosition[i]) {
      // Apply reduction and safety subtraction for non-external tokens

      let reduced = reduceAmount(withdrawalAmounts[i]);
      swapAmounts.push(reduced.toString());
    } else {
      const positionWrapperCurrent = new ethers.Contract(positionWrappers[wrapperIndex], POSITION_WRAPPER_ABI, provider);

      let percentage = await amountCalculationsAlgebra.getPercentage(
        withdrawalAmounts[i],
        (await positionWrapperCurrent.totalSupply()).toString()
      );

      let withdrawAmounts = await calculateOutputAmounts(
        tokens[i],
        amountCalculationsAddress,
        percentage.toString()
      );
      if (withdrawAmounts.token0Amount.gt(0)) {
        let reduced = reduceAmount(withdrawAmounts.token0Amount);
        swapAmounts.push(reduced.toString());
      }
      if (withdrawAmounts.token1Amount.gt(0)) {
        let reduced = reduceAmount(withdrawAmounts.token1Amount);
        swapAmounts.push(reduced.toString());
      }
      wrapperIndex++;
    }
  }

  return { swapAmounts };
}

export async function calculateOutputAmounts(
  _positionWrapperAddress,
  amountCalculationsAddress,
  _percentage
) {
  const amountCalculationsAlgebra = new ethers.Contract(amountCalculationsAddress, AMOUNT_CALCULATIONS_ALGEBRA_ABI, provider);

  let result =
    await amountCalculationsAlgebra.callStatic.getLiquidityAmountsForPartialWithdrawal(
      _positionWrapperAddress,
      _percentage
    );

  let token0Amount = result.amount0Out;
  let token1Amount = result.amount1Out;

  return { token0Amount, token1Amount };
}

// DEPOSIT + WITHDRAWAL

// Calculates the required swap (amount and direction) to reinvest collected fees according to the pool's target ratio.
export async function getReinvestmentSwapInfo(
  position,
  priceOracleAddress,
  amountCalculationsAddress
) {
  // Get the fee amounts and desired amounts
  const expectedFees = await getExpectedFeesExternalPosition(
    position,
    priceOracleAddress
  );

  const currentRatioAmounts = await getCurrentRatio(
    position,
    priceOracleAddress,
    amountCalculationsAddress
  );

  // Get token addresses
  const positionWrapper = new ethers.Contract(position, POSITION_WRAPPER_ABI, provider);
  const token0 = await positionWrapper.token0();
  const token1 = await positionWrapper.token1();

  // Calculate the amount to swap
  return getSwapInfoToDesiredRatioBN(
    expectedFees.amount0USD,
    expectedFees.amount1USD,
    currentRatioAmounts.amount0USD,
    currentRatioAmounts.amount1USD,
    token0,
    token1
  );
}

function getSwapInfoToDesiredRatioBN(
  feeAmount0USD,
  feeAmount1USD,
  desiredAmount0USD,
  desiredAmount1USD,
  token0,
  token1
) {
  const scale = BigNumber.from("1000000000000000000"); // 1e18

  if (feeAmount0USD.eq(0) && feeAmount1USD.eq(0)) {
    return {
      swapAmount: BigNumber.from(0),
      tokenIn: ethers.constants.AddressZero,
      tokenOut: ethers.constants.AddressZero,
    };
  }
  const totalFee = feeAmount0USD.add(feeAmount1USD);
  const totalDesired = desiredAmount0USD.add(desiredAmount1USD);

  // Calculate ratios as scaled integers
  const currentRatio = feeAmount0USD.mul(scale).div(totalFee);
  const desiredRatio = desiredAmount0USD.mul(scale).div(totalDesired);

  if (currentRatio.sub(desiredRatio).abs().lt(1000)) {
    // ~1e-15 tolerance
    return {
      swapAmount: BigNumber.from(0),
      tokenIn: ethers.constants.AddressZero,
      tokenOut: ethers.constants.AddressZero,
      note: "Already at desired ratio",
    };
  }

  if (currentRatio.lt(desiredRatio)) {
    // Need to buy token0 (swap token1 for token0)
    const swapAmount = totalFee.mul(desiredRatio).div(scale).sub(feeAmount0USD);
    return {
      swapAmount,
      tokenIn: token1,
      tokenOut: token0,
    };
  } else {
    // Need to buy token1 (swap token0 for token1)
    const swapAmount = feeAmount0USD.sub(totalFee.mul(desiredRatio).div(scale));
    return {
      swapAmount,
      tokenIn: token0,
      tokenOut: token1,
    };
  }
}

export async function getExpectedFeesExternalPosition(
  position,
  priceOracleAddress
) {
  const PositionWrapper = await ethers.getContractFactory("PositionWrapper");
  const positionWrapper = PositionWrapper.attach(position);

  const nftManagerAbi = [
    // Only include the functions you need
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function collect((uint256,address,uint128,uint128)) returns (uint256,uint256)",
  ];


  // 1. Get the contract instance
  const nftManager = new ethers.Contract(
    "0xa51adb08cbe6ae398046a23bec013979816b77ab", // your contract address
    nftManagerAbi,
    provider
  );

  const tokenId = await positionWrapper.tokenId();
  let amount0USD = BigNumber.from(0);
  let amount1USD = BigNumber.from(0);

  if (Number(BigNumber.from(tokenId)) != 0) {
    // 2. Prepare the params
    const params = [
      tokenId,
      await nftManager.ownerOf(tokenId),
      MaxUint128,
      MaxUint128,
    ];

    const positionManagerSigner = await ethers.getSigner(
      await positionWrapper.parentPositionManager()
    );

    // 3. Call collect as a static call to preview the amounts
    const [amount0, amount1] = await nftManager
      .connect(positionManagerSigner)
      .callStatic.collect(params, {
        value: 0,
      });

    // Convert amount0, amount1 to USD (here we use stable coins for testing so we can skip)
    amount0USD = await getTokenUsdValue(
      await positionWrapper.token0(),
      priceOracleAddress,
      BigNumber.from(amount0).toString()
    );

    amount1USD = await getTokenUsdValue(
      await positionWrapper.token1(),
      priceOracleAddress,
      BigNumber.from(amount1).toString()
    );
  }

  return { amount0USD, amount1USD };
}

export async function getCurrentRatio(
  position,
  priceOracleAddress,
  amountCalculationsAddress
) {
  const amountCalculationsAlgebra = new ethers.Contract(amountCalculationsAddress, AMOUNT_CALCULATIONS_ALGEBRA_ABI, provider);

  const positionWrapper = new ethers.Contract(position, POSITION_WRAPPER_ABI, provider);

  let positionManagerAddress = await positionWrapper.parentPositionManager();

  // Get amounts for new price range (to calculate the ratio)
  let amounts =
    await amountCalculationsAlgebra.callStatic.getRatioAmountsForTicks(
      position,
      await positionWrapper.initialTickLower(),
      await positionWrapper.initialTickUpper()
    );

  // Add current contract balance (previous dust)
  const token0Contract = new ethers.Contract(await positionWrapper.token0(), ERC20_ABI, provider);
  const contractBalanceT0 = await token0Contract.balanceOf(positionManagerAddress);
  const token1Contract = new ethers.Contract(await positionWrapper.token1(), ERC20_ABI, provider);
  const contractBalanceT1 = await token1Contract.balanceOf(positionManagerAddress);

  // Convert amount0, amount1 to USD (here we use stable coins for testing so we can skip)
  let amount0USD = await getTokenUsdValue(
    await positionWrapper.token0(),
    priceOracleAddress,
    BigNumber.from(amounts.amount0).add(contractBalanceT0).toString()
  );

  let amount1USD = await getTokenUsdValue(
    await positionWrapper.token1(),
    priceOracleAddress,
    BigNumber.from(amounts.amount1).add(contractBalanceT1).toString()
  );

  return { amount0USD, amount1USD };
}

// Gathers all data needed for a batch deposit, including swap and position info.
export async function getExternalPositionData(
  portfolioAddress,
  priceOracleAddress,
  tokenBalanceLibraryAddress,
  swapVerificationLibraryAddress,
  amountCalculationsAddress
) {
  // @todo
  // we need to add multiple position managers for each token the corresponding manager
  // add fee tier for each pool, no hardcoded to 100

  let isTokenExternalPosition = [];
  let isExternalPosition = [];
  let positionWrapperIndex = [];
  let positionWrappers = [];
  let portfolioTokenIndex = [];
  let swapTokens = [];
  let index0 = [];
  let index1 = [];
  let indexCounter = 0;

  let tokensIn = [];
  let tokensOut = [];
  let swapAmounts = [];
  let feeTiers = [];

  let swapDeployer = [];
  let amountsMin0 = [];
  let amountsMin1 = [];


  // Get tokens from portfolio
  const portfolio = new ethers.Contract(portfolioAddress, PORTFOLIO_ABI, provider);
  const tokens = await portfolio.getTokens();
  console.log("tokens", tokens);

  const config = await portfolio.assetManagementConfig();


  let assetManagementConfig = new ethers.Contract(config, ASSET_MANAGEMENT_CONFIG_ABI, provider);

  let positionManagerAddress =
    await assetManagementConfig.lastDeployedPositionManager();
  console.log("positionManagerAddress", positionManagerAddress);

  if (positionManagerAddress != "0x0000000000000000000000000000000000000000") {
    const positionManager = new ethers.Contract(positionManagerAddress, POSITION_MANAGER_ALGEBRA_ABI, provider);


    const externalPositionStorage = new ethers.Contract(await positionManager.externalPositionStorage(), EXTERNAL_POSITION_STORAGE_ABI, provider);

    for (let i = 0; i < tokens.length; i++) {
      if (await externalPositionStorage.isWrappedPosition(tokens[i])) {
        isTokenExternalPosition.push(true);
        isExternalPosition.push(true, true);
        positionWrapperIndex.push(i);
        positionWrappers.push(tokens[i]);

        index0.push(indexCounter);
        indexCounter++;
        index1.push(indexCounter);

        // Push underlying tokens to the swap token list

        const positionWrapper = new ethers.Contract(tokens[i], POSITION_WRAPPER_ABI, provider);
        swapTokens.push(
          await positionWrapper.token0(),
          await positionWrapper.token1()
        );

        portfolioTokenIndex.push(i, i);

        let reinvestmentSwapInfo = await getReinvestmentSwapInfo(
          tokens[i],
          priceOracleAddress,
          amountCalculationsAddress
        );

        tokensIn.push((await reinvestmentSwapInfo).tokenIn);
        tokensOut.push((await reinvestmentSwapInfo).tokenOut);
        swapAmounts.push((await reinvestmentSwapInfo).swapAmount);
        feeTiers.push(FEE_TIER);

        amountsMin0.push(0);
        amountsMin1.push(0);
        swapDeployer.push(ethers.constants.AddressZero);
      } else {
        isTokenExternalPosition.push(false);
        isExternalPosition.push(false);
        portfolioTokenIndex.push(i);
        swapTokens.push(tokens[i]);
      }
      indexCounter++;
    }
  } else {
    console.log("no position manager found");
    swapTokens = tokens;
    console.log("swapTokens", swapTokens);
    for (let i = 0; i < tokens.length; i++) {
      portfolioTokenIndex.push(i);
    }
    // positionWrapperIndex.push(0);
    // positionWrappers.push(ZERO_ADDRESS);
    isExternalPosition = Array(tokens.length).fill(false);
  }
  return {
    positionWrappers,
    positionWrapperIndex,
    swapTokens,
    isExternalPosition,
    portfolioTokenIndex,
    isTokenExternalPosition,
    index0,
    index1,
    tokensIn,
    tokensOut,
    swapAmounts,
    feeTiers,
    amountsMin0,
    amountsMin1,
    swapDeployer,
  };
}

// GENERAL

export async function createEnsoCallDataRoute(
  spender,
  receiver,
  _tokenIn,
  _tokenOut,
  _amountIn
) {
  const params = {
    chainId: CHAIN_ID,
    fromAddress: spender,
    receiver: receiver,
    spender: spender,
    amountIn: _amountIn,
    slippage: SLIPPAGE,
    tokenIn: _tokenIn,
    tokenOut: _tokenOut,
    routingStrategy: "delegate",
  };

  const postUrl = "https://api.enso.finance/api/v1/shortcuts/route?";

  const headers = {
    //"Content-Type": "application/json",
    Authorization: import.meta.env.VITE_ENSO_KEY,
  };

  return await axios.get(postUrl + `${qs.stringify(params)}`, {
    headers,
  });
}

// Example: Convert token amount to USD
export async function getTokenUsdValue(
  tokenAddress,
  priceOracleAddress,
  amount
) {
  const priceOracle = new ethers.Contract(priceOracleAddress, PRICE_ORACLE_ABI, provider);

  return await priceOracle.convertToUSD18Decimals(tokenAddress, amount);
}

// Helper Functions
function splitEqually(amount, numParts) {
  const perPart = amount.div(numParts);
  return Array(numParts).fill(perPart.toString());
}

function calculateRatio(amount, total) {
  return total.eq(0) ? BigNumber.from(0) : amount.mul(SCALE).div(total);
}

function reduceAmount(amount) {
  let reduced = amount.mul(BASIS_POINTS).div(DIVISOR);
  if (reduced.gt(SAFETY_WEI)) {
    reduced = reduced.sub(SAFETY_WEI);
  }
  return reduced;
}
