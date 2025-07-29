import { PERMIT2_ADDRESS, AllowanceTransfer } from "@uniswap/permit2-sdk";

import axios from "axios";
import qs from "qs";

import { BigNumber, Contract, Signer } from "ethers";

import { ethers } from "ethers";

import {
  PORTFOLIO_ABI,
  IAllowanceTransfer,
  POSITION_WRAPPER_ABI,
  PORTFOLIO_CALCULATIONS_ABI,
  ERC20_ABI,
  AMOUNT_CALCULATIONS_ALGEBRA_ABI,
  tokenBalanceLibraryAddress,
  ASSET_MANAGEMENT_CONFIG_ABI,
  POSITION_MANAGER_ALGEBRA_ABI,
  EXTERNAL_POSITION_STORAGE_ABI,
  PRICE_ORACLE_ABI,
  VENUS_ASSET_HANDLER_ABI,
  venusAssetHandlerAddress,
  VENUS_TOKEN_ABI,
} from "./contracts.js";

import { PoolFeeCalculator } from "./poolFeeCalculator";

import { chainIdToAddresses } from "./networkVariables";

const MaxUint128 = ethers.BigNumber.from("0xffffffffffffffffffffffffffffffff");

const provider = new ethers.providers.JsonRpcProvider(
  import.meta.env.VITE_RPC_URL
);

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
  // Get tokens from portfolio
  const portfolio = new ethers.Contract(
    portfolioAddress,
    PORTFOLIO_ABI,
    provider
  );
  const tokens = await portfolio.getTokens();

  // Get permit2 contract
  const permit2 = new ethers.Contract(
    PERMIT2_ADDRESS,
    AllowanceTransfer.abi,
    provider
  );

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
    // Add Venus borrowing logic

    // Get comptroller address
    const comptrollerAddress = "0xfD36E2c2a6789Db23113685031d7F16329158384";

    // Get all account data in one call
    const [accountData, tokenAddresses] =
      await venusAssetHandler.callStatic.getUserAccountData(
        vaultAddress,
        comptrollerAddress,
        []
      );

    const { lendTokens, borrowTokens } = tokenAddresses;
    const vTokenSet = new Set(lendTokens);

    // Convert totalDebt to 18 decimals (it's in 8 decimals from Venus)
    const totalDebt18Decimals = accountData.totalDebt.mul(
      ethers.BigNumber.from(10).pow(10)
    );

    let usdBalances = [];
    let totalUsd = BigNumber.from(0);
    let collateralTokenIndices = [];
    console.log("**********step 3 done*****************");
    for (let i = 0; i < numTokens; i++) {
      const token = tokens[i];
      if (reinvestmentSwapInfo.isTokenExternalPosition[i]) {
        // For external positions, get underlying token amounts using calculateOutputAmounts with 100%
        const { token0Amount, token1Amount } = await calculateOutputAmounts(
          token,
          amountCalculationsAddress,
          "10000" // 100% in 1e18 precision
        );
        const positionWrapper = new ethers.Contract(
          token,
          POSITION_WRAPPER_ABI,
          provider
        );
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
        console.log("*******************step 4 done*******************");
        // External positions are typically not used as collateral
      } else if (vTokenSet.has(token)) {
        // It's a vToken - check if it's collateral
        const isCollateral = await venusAssetHandler.isCollateralEnabled(
          token,
          vaultAddress,
          comptrollerAddress
        );

        const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
        const bal = await erc20.balanceOf(vaultAddress);

        // Calculate underlying amount using exchange rate
        const vTokenContract = new ethers.Contract(
          token,
          VENUS_TOKEN_ABI,
          provider
        );
        const snapshot = await vTokenContract.getAccountSnapshot(vaultAddress);
        const exchangeRateMantissa = snapshot[3];
        const underlyingAmount = bal
          .mul(exchangeRateMantissa)
          .div(ethers.BigNumber.from(10).pow(18));
        let underlying;
        if (token == "0xA07c5b74C9B40447a954e1466938b865b6BBea36") {
          underlying = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        } else {
          underlying = await venusAssetHandler.getUnderlyingToken(token);
        }
        const usd = await getTokenUsdValue(
          underlying,
          priceOracleAddress,
          underlyingAmount.toString()
        );

        usdBalances.push(usd);
        totalUsd = totalUsd.add(usd);

        if (isCollateral) {
          collateralTokenIndices.push(i);
        }
      } else {
        // Regular token
        const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
        const bal = await erc20.balanceOf(vaultAddress);
        const usd = await getTokenUsdValue(
          token,
          priceOracleAddress,
          bal.toString()
        );
        usdBalances.push(usd);
        totalUsd = totalUsd.add(usd);
      }
    }

    // Distribute debt among collateral tokens
    const adjustedUSDValues = [...usdBalances];
    if (collateralTokenIndices.length > 0) {
      const debtPerCollateralToken = totalDebt18Decimals.div(
        collateralTokenIndices.length
      );

      for (const collateralIndex of collateralTokenIndices) {
        adjustedUSDValues[collateralIndex] = adjustedUSDValues[
          collateralIndex
        ].sub(debtPerCollateralToken);
      }
    }

    // Calculate total adjusted value
    const totalAdjustedValue = adjustedUSDValues.reduce(
      (sum, value) => sum.add(value),
      BigNumber.from(0)
    );

    if (totalAdjustedValue.eq(0)) {
      // fallback to equal split if all USD values are zero
      splitAmounts = splitEqually(BigNumber.from(depositAmount), numTokens);
    } else {
      for (let i = 0; i < numTokens; i++) {
        let amount = BigNumber.from(depositAmount)
          .mul(adjustedUSDValues[i])
          .div(totalAdjustedValue);
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
      const positionWrapper = new ethers.Contract(
        token,
        POSITION_WRAPPER_ABI,
        provider
      );
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
        const splitAmountBN = BigNumber.from(splitAmount);
        const amount0 = splitAmountBN
          .mul(ratio0)
          .div(ethers.BigNumber.from(10).pow(18));
        const amount1 = splitAmountBN
          .mul(ratio1)
          .div(ethers.BigNumber.from(10).pow(18));
        finalTokens.push(token0, token1);
        finalAmounts.push(amount0.toString(), amount1.toString());
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

  console.log("*****************step 1 done*********************");

  const portfolio = new ethers.Contract(
    portfolioAddress,
    PORTFOLIO_ABI,
    provider
  );
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
  console.log("*****************step 2 done*********************");

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
    reinvestmentSwapInfo.isTokenExternalPosition,
    reinvestmentSwapInfo.positionWrappers,
    withdrawalAmounts
  );

  const {
    flashLoanAmounts,
    amountToSell,
    lendTokensSet,
    borrowTokens,
    poolFees,
    lendTokens,
    flashLoanToken,
    thenaPoolInfo,
    flashLoanProtocolToken,
    bufferUnit,
    flashloanBufferUnit
  } = await getFlashLoanData(
    portfolioAddress,
    tokenBalanceLibraryAddress,
    swapVerificationLibraryAddress,
    amountCalculationsAddress,
    portfolioCalculationsAddress,
    userAddress
  );
  const portfolio = new ethers.Contract(
    portfolioAddress,
    PORTFOLIO_ABI,
    provider
  );
  const vault = await portfolio.vault();

  let swapTokens = reinvestmentSwapInfo.swapTokens;

  const amountPortfolioToken = BigNumber.from(
    await portfolio.balanceOf(userAddress)
  );
  const lendTokenToAmountIndex = new Map();
  for (let i = 0; i < lendTokens.length; i++) {
    lendTokenToAmountIndex.set(lendTokens[i], i);
  }
  let ensoCalldata = [];
  let swapTokensFinal = [];
  for (let i = 0; i < swapTokens.length; i++) {
    let withdrawalAmount = withdrawalAmounts[i];
    if (swapTokens[i] != withdrawalToken) {
      if (lendTokensSet.has(swapTokens[i])) {
        const tokenContract = new ethers.Contract(
          swapTokens[i],
          ERC20_ABI,
          provider
        );
        const vaultBalance = await tokenContract.balanceOf(vault);
        const userShare = vaultBalance
          .mul(amountPortfolioToken)
          .div(await portfolio.totalSupply());
        const amountIndex = lendTokenToAmountIndex.get(swapTokens[i]);
        console.log("amountToSell[amountIndex]:", amountToSell[amountIndex]);

        withdrawalAmount = userShare.sub(amountToSell[amountIndex]);
      } else {
        swapTokensFinal.push(swapTokens[i]);
        let response = await createEnsoCallDataRoute(
          withdrawBatchAddress,
          userAddress,
          swapTokens[i],
          withdrawalToken,
          BigNumber.from(swapAmounts[i]).toString()
        );
        ensoCalldata.push(response.data.tx.data);
      }
    } else {
      ensoCalldata.push("0x");
    }
  }

  return {
    reinvestmentSwapInfo,
    ensoCalldata,
    flashLoanAmounts,
    poolFees,
    swapTokensFinal,
    flashLoanToken,
    thenaPoolInfo,
    flashLoanProtocolToken,
    bufferUnit,
    flashloanBufferUnit
  };
}

async function getPoolFeesForWithdrawal(
  flashLoanToken,
  vDebtTokens, // Now in vToken format
  vLendTokens, // Now in vToken format
  addresses,
  chainId,
  venusAssetHandler
) {
  const calculator = new PoolFeeCalculator(
    addresses.PancakeSwapV3FactoryAddress,
    chainId,
    venusAssetHandler
  );
  return await calculator.getPoolFeesForWithdrawal(
    flashLoanToken,
    vDebtTokens,
    vLendTokens,
    addresses
  );
}

export async function getFlashLoanData(
  portfolioAddress,
  tokenBalanceLibraryAddress,
  swapVerificationLibraryAddress,
  amountCalculationsAddress,
  portfolioCalculationsAddress,
  userAddress
) {
  const addresses = chainIdToAddresses[56];

  const portfolio = new ethers.Contract(
    portfolioAddress,
    PORTFOLIO_ABI,
    provider
  );
  const vault = await portfolio.vault();
  const tokens = await portfolio.getTokens();

  // for now we make it constant, we can make it dynamic later
  let flashLoanProtocolToken; // TakflashLoanProtocolTokening USDT as collateral token
  let flashLoanToken;
  let poolFees;
  let thenaPoolInfo;

  let flashLoanAmounts = [];

  const venusAssetHandler = new ethers.Contract(
    venusAssetHandlerAddress,
    VENUS_ASSET_HANDLER_ABI,
    provider
  );

  const [lendTokens, borrowTokens] =
    await venusAssetHandler.getAllProtocolAssets(
      vault,
      addresses.corePool_controller,
      []
    );

  // Replace the flash loan token selection logic with:
  if (borrowTokens.length === 0) {
    console.log("✅ No borrowed tokens - proceeding with simple withdrawal");
    flashLoanProtocolToken = addresses.vUSDT_Address;
    flashLoanToken = addresses.USDT;
    poolFees = { poolFees: [[]] }; // Empty pool fees
    thenaPoolInfo = {
      _factory: "0x306F06C147f064A010530292A1EB6737c3e378e4",
      _token0: addresses.USDT,
      _token1: addresses.USDC_Address,
      _flashLoanToken: addresses.USDT
    };
  } else {
    console.log(`🔍 ${borrowTokens.length === 1 ? 'Single' : 'Multiple'} borrowed tokens - selecting optimal flash loan token`);
    
    const calculator = new PoolFeeCalculator(
      addresses.PancakeSwapV3FactoryAddress,
      56,
      venusAssetHandler
    );
    
    try {
      // Get optimal flash loan token AND Thena pool info
      const flashLoanSelection = await calculator.selectOptimalFlashLoanToken(
        borrowTokens,
        lendTokens,
        addresses
      );
      
      flashLoanProtocolToken = flashLoanSelection.flashLoanProtocolToken;
      flashLoanToken = flashLoanSelection.flashLoanToken;
      
      // Calculate pool fees
      poolFees = await calculator.getPoolFeesForWithdrawal(
        flashLoanToken,
        borrowTokens,
        lendTokens,
        addresses
      );
      
      thenaPoolInfo = {
        _factory: flashLoanSelection.thenaFactory,
        _token0: flashLoanSelection.thenaToken0,
        _token1: flashLoanSelection.thenaToken1,
        _flashLoanToken: flashLoanSelection.flashLoanToken
      };
      
      console.log("Selected flash loan token:", flashLoanToken);
      console.log("Selected Thena pool:", thenaPoolInfo);
      
    } catch (error) {
      console.log(`❌ Error in flash loan selection: ${error.message}`);
      console.log("⚠️ Falling back to default USDT flash loan");
      
      // Fallback to USDT
      flashLoanProtocolToken = addresses.vUSDT_Address;
      flashLoanToken = addresses.USDT;
      poolFees = { poolFees: [[]] }; // Default empty pool fees
      thenaPoolInfo = {
        _factory: "0x306F06C147f064A010530292A1EB6737c3e378e4",
        _token0: addresses.USDT,
        _token1: addresses.USDC_Address,
        _flashLoanToken: addresses.USDT
      };
    }
  }
  
  console.log("Selected flash loan protocol token:", flashLoanProtocolToken);
  console.log("Selected flash loan token:", flashLoanToken);
  console.log("Token0:", thenaPoolInfo._token0);
  console.log("Token1:", thenaPoolInfo._token1);
  console.log("Factory:", thenaPoolInfo._factory);


  let flashloanBufferUnit = 18; //Flashloan buffer unit in 1/10000, extra flashlaon to take, to fulfil the swap(from flashlaon to debt token)
  let bufferUnit = 280; //Buffer unit for collateral amount in 1/100000, extra collateral to take, to fulfil the swap(from collateral underlying to flashlaon token)
  const amountPortfolioToken = BigNumber.from(
    await portfolio.balanceOf(userAddress)
  );

  const portfolioCalculations = new ethers.Contract(
    portfolioCalculationsAddress,
    PORTFOLIO_CALCULATIONS_ABI,
    provider
  );
  const values =
    await portfolioCalculations.calculateBorrowedPortionAndFlashLoanDetails(
      portfolio.address,
      flashLoanProtocolToken,
      vault,
      addresses.corePool_controller,
      venusAssetHandlerAddress,
      amountPortfolioToken,
      flashloanBufferUnit
    );

  const debtRepayAmount = values[0];

  console.log("debtRepayAmount:", debtRepayAmount);

  const lendTokensSet = new Set(lendTokens);

  console.log("lendTokens:", lendTokens);
  console.log("borrowTokens:", borrowTokens);

  // const poolFees = await getPoolFeesForWithdrawal(
  //   addresses.ETH_Address, // flashLoanToken (normal token)
  //   borrowTokens, // vDebtTokens (vToken format)
  //   lendTokens, // vLendTokens (vToken format)
  //   addresses,
  //   56,
  //   venusAssetHandler // Pass the venusAssetHandler
  // );

  console.log("poolFees:", poolFees.poolFees);

  console.log("------------- Calculating FlashLoanAmount -------------");
  // the above 2 values are dependent, the more  weincrease flashlaon buffer unit, the more collateral we need to take, to fulfil the swap(i.e bufferUnit)
  // Need a function ot predict the values correctly

  // No.Of borrowed tokens, we can get from  calculateBorrowedPortionAndFlashLoanDetails(returns borrowed portion,FlashLoanAmount needed, underlyings of borrowedTokens, borrowedTokens(in VToken format))
  // If 1, then take flashloan token == borrow token, and flashLaon amount == borrowed amount, only bufferUnit is needed
  // If > 1, use data from calculateBorrowedPortionAndFlashLoanDetails and fetch flashLoanAmount, both bufferUnit and flashloanBufferUnit are needed

  const amountToSell =
    await portfolioCalculations.callStatic.getCollateralAmountToSell(
      vault,
      addresses.corePool_controller,
      venusAssetHandler.address,
      borrowTokens,
      tokens,
      debtRepayAmount,
      "10", // 10 basis from thena pool fee(can be fetched from thena)
      bufferUnit
    );

  if (values[3].length > 1) {
    flashLoanAmounts.push(values[1]);
  } else {
    let borrowedToken = values[3][0]; // In vToken format
    const balanceBorrowed =
      await portfolioCalculations.getVenusTokenBorrowedBalance(
        [borrowedToken],
        vault
      );
    console.log("balanceBorrowed:", balanceBorrowed);
    let borrowed = balanceBorrowed[0]
      .mul(amountPortfolioToken)
      .div(await portfolio.totalSupply());
    flashLoanAmounts.push([borrowed.toString()]);
  }

  console.log("flashLoanAmounts:", flashLoanAmounts);
  console.log("AmountToSell:", amountToSell);

  return {
    flashLoanAmounts,
    amountToSell,
    lendTokensSet,
    borrowTokens,
    poolFees,
    lendTokens,
    flashLoanToken,
    thenaPoolInfo,
    flashLoanProtocolToken,
    bufferUnit,
    flashloanBufferUnit
  };
}

export async function getWithdrawalAmounts(
  tokenBalanceLibraryAddress,
  portfolioCalculationsAddress,
  portfolioAddress,
  portfolioTokenWithdrawAmount
) {
  let portfolioCalculations = new ethers.Contract(
    portfolioCalculationsAddress,
    PORTFOLIO_CALCULATIONS_ABI,
    provider
  );
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
  const portfolio = new ethers.Contract(
    portfolioAddress,
    PORTFOLIO_ABI,
    provider
  );
  const tokens = await portfolio.getTokens();

  let swapAmounts = [];
  let wrapperIndex = 0;

  const amountCalculationsAlgebra = new ethers.Contract(
    amountCalculationsAddress,
    AMOUNT_CALCULATIONS_ALGEBRA_ABI,
    provider
  );

  for (let i = 0; i < tokens.length; i++) {
    if (!isTokenExternalPosition[i]) {
      // Apply reduction and safety subtraction for non-external tokens

      let reduced = reduceAmount(withdrawalAmounts[i]);
      swapAmounts.push(reduced.toString());
    } else {
      const positionWrapperCurrent = new ethers.Contract(
        positionWrappers[wrapperIndex],
        POSITION_WRAPPER_ABI,
        provider
      );

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
  const amountCalculationsAlgebra = new ethers.Contract(
    amountCalculationsAddress,
    AMOUNT_CALCULATIONS_ALGEBRA_ABI,
    provider
  );

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

  console.log("expectedFees", expectedFees);

  const currentRatioAmounts = await getCurrentRatio(
    position,
    priceOracleAddress,
    amountCalculationsAddress
  );

  console.log("currentRatioAmounts", currentRatioAmounts);

  // Get token addresses
  const positionWrapper = new ethers.Contract(
    position,
    POSITION_WRAPPER_ABI,
    provider
  );
  const token0 = await positionWrapper.token0();
  const token1 = await positionWrapper.token1();

  console.log("token0", token0);
  console.log("token1", token1);

  // Calculate the amount to swap using USD amounts for ratios and token amounts for swap calculation
  return getSwapInfoToDesiredRatioBN(
    expectedFees.tokenBalance0,
    expectedFees.tokenBalance1,
    expectedFees.amount0USD,
    expectedFees.amount1USD,
    currentRatioAmounts.amount0USD,
    currentRatioAmounts.amount1USD,
    token0,
    token1
  );
}

function getSwapInfoToDesiredRatioBN(
  tokenBalance0,
  tokenBalance1,
  feeAmount0USD,
  feeAmount1USD,
  desiredAmount0USD,
  desiredAmount1USD,
  token0,
  token1
) {
  const scale = BigNumber.from("1000000000000000000"); // 1e18
  const MIN_REINVESTMENT_AMOUNT = 1000000;

  // Early exit if no balances
  if (
    (feeAmount0USD.eq(0) && feeAmount1USD.eq(0)) ||
    (feeAmount0USD.lt(1 * ethers.constants.WeiPerEther) &&
      feeAmount1USD.lt(1 * ethers.constants.WeiPerEther))
  ) {
    return {
      swapAmount: BigNumber.from(0),
      tokenIn: ethers.constants.AddressZero,
      tokenOut: ethers.constants.AddressZero,
    };
  }

  const totalFee = feeAmount0USD.add(feeAmount1USD);
  const totalDesired = desiredAmount0USD.add(desiredAmount1USD);

  // Calculate current and desired ratios (scaled by 1e18 for precision)
  const currentRatio = feeAmount0USD.mul(scale).div(totalFee);
  const desiredRatio = desiredAmount0USD.mul(scale).div(totalDesired);

  // Check if already at desired ratio (with small tolerance)
  if (currentRatio.sub(desiredRatio).abs().lt(scale.div(1000))) {
    // 0.1% tolerance
    return {
      swapAmount: BigNumber.from(0),
      tokenIn: ethers.constants.AddressZero,
      tokenOut: ethers.constants.AddressZero,
      note: "Already at desired ratio",
    };
  }

  // Calculate ratios as percentages for logging
  const currentRatioPercent = currentRatio.mul(100).div(scale);
  const desiredRatioPercent = desiredRatio.mul(100).div(scale);

  console.log(`Current ratio: ${currentRatioPercent.toString()}% token0`);
  console.log(`Desired ratio: ${desiredRatioPercent.toString()}% token0`);
  console.log(
    `Current USD amounts: ${feeAmount0USD.toString()} token0, ${feeAmount1USD.toString()} token1`
  );
  console.log(
    `Desired USD amounts: ${desiredAmount0USD.toString()} token0, ${desiredAmount1USD.toString()} token1`
  );
  console.log(
    `Current token amounts: ${tokenBalance0.toString()} token0, ${tokenBalance1.toString()} token1`
  );

  // Calculate what we should have based on current total and desired ratio
  const totalCurrentUSD = feeAmount0USD.add(feeAmount1USD);
  const targetToken0USD = totalCurrentUSD.mul(desiredRatio).div(scale);
  const targetToken1USD = totalCurrentUSD.sub(targetToken0USD);

  console.log(
    `Target USD amounts: ${targetToken0USD.toString()} token0, ${targetToken1USD.toString()} token1`
  );

  // Determine which token has excess and needs to be sold
  const excessToken0USD = feeAmount0USD.sub(targetToken0USD);
  const excessToken1USD = feeAmount1USD.sub(targetToken1USD);

  console.log(`Token0 excess USD: ${excessToken0USD.toString()}`);
  console.log(`Token1 excess USD: ${excessToken1USD.toString()}`);

  if (excessToken0USD.gt(0)) {
    // Token0 has excess, need to sell token0 for token1
    console.log(`Selling token0 to buy token1`);

    // Calculate swap amount: (excess_usd / current_usd) × tokenBalance
    let swapAmount = excessToken0USD.mul(tokenBalance0).div(feeAmount0USD);

    console.log(`Calculated swap amount: ${swapAmount.toString()} token0`);
    console.log(`Available token0 balance: ${tokenBalance0.toString()}`);

    // Check if swap amount exceeds available balance
    if (swapAmount.gt(tokenBalance0)) {
      swapAmount = tokenBalance0; // Cap at available balance
      console.log(`Capped swap amount: ${swapAmount.toString()}`);
      console.log(
        `Note: Cannot achieve full desired ratio with available balance`
      );
    }

    // Calculate expected ratio after swap
    const swapUSDValue = swapAmount.mul(feeAmount0USD).div(tokenBalance0);
    const newToken0USD = feeAmount0USD.sub(swapUSDValue);
    const newToken1USD = feeAmount1USD.add(swapUSDValue);
    const newTotal = newToken0USD.add(newToken1USD);
    const newRatio = newToken0USD.mul(scale).div(newTotal);
    const newRatioPercent = newRatio.mul(100).div(scale);

    console.log(
      `Expected ratio after swap: ${newRatioPercent.toString()}% token0`
    );

    return {
      swapAmount,
      tokenIn: token0,
      tokenOut: token1,
    };
  } else if (excessToken1USD.gt(0)) {
    // Token1 has excess, need to sell token1 for token0
    console.log(`Selling token1 to buy token0`);

    // Calculate swap amount: (excess_usd / current_usd) × tokenBalance
    let swapAmount = excessToken1USD.mul(tokenBalance1).div(feeAmount1USD);

    console.log(`Calculated swap amount: ${swapAmount.toString()} token1`);
    console.log(`Available token1 balance: ${tokenBalance1.toString()}`);

    // Check if swap amount exceeds available balance
    if (swapAmount.gt(tokenBalance1)) {
      swapAmount = tokenBalance1; // Cap at available balance
      console.log(`Capped swap amount: ${swapAmount.toString()}`);
      console.log(
        `Note: Cannot achieve full desired ratio with available balance`
      );
    }

    // Calculate expected ratio after swap
    const swapUSDValue = swapAmount.mul(feeAmount1USD).div(tokenBalance1);
    const newToken0USD = feeAmount0USD.add(swapUSDValue);
    const newToken1USD = feeAmount1USD.sub(swapUSDValue);
    const newTotal = newToken0USD.add(newToken1USD);
    const newRatio = newToken0USD.mul(scale).div(newTotal);
    const newRatioPercent = newRatio.mul(100).div(scale);

    console.log(
      `Expected ratio after swap: ${newRatioPercent.toString()}% token0`
    );

    return {
      swapAmount,
      tokenIn: token1,
      tokenOut: token0,
    };
  } else {
    // This shouldn't happen if we passed the tolerance check
    return {
      swapAmount: BigNumber.from(0),
      tokenIn: ethers.constants.AddressZero,
      tokenOut: ethers.constants.AddressZero,
      note: "No excess found",
    };
  }
}

export async function getExpectedFeesExternalPosition(
  position,
  priceOracleAddress
) {
  const positionWrapper = new ethers.Contract(
    position,
    POSITION_WRAPPER_ABI,
    provider
  );

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
  let tokenBalance0 = BigNumber.from(0);
  let tokenBalance1 = BigNumber.from(0);

  if (Number(BigNumber.from(tokenId)) != 0) {
    const positionWrapper = new ethers.Contract(
      position,
      POSITION_WRAPPER_ABI,
      provider
    );

    let positionManagerAddress = await positionWrapper.parentPositionManager();

    // 2. Prepare the params
    const params = [
      tokenId,
      await nftManager.ownerOf(tokenId),
      MaxUint128,
      MaxUint128,
    ];

    const positionManagerSigner = await provider.getSigner(
      await positionWrapper.parentPositionManager()
    );

    // 3. Call collect as a static call to preview the amounts
    const [amount0, amount1] = await nftManager
      .connect(positionManagerSigner)
      .callStatic.collect(params, {
        value: 0,
      });

    const contractBalanceT0 = await new ethers.Contract(
      await positionWrapper.token0(),
      ERC20_ABI,
      provider
    ).balanceOf(positionManagerAddress);
    const contractBalanceT1 = await new ethers.Contract(
      await positionWrapper.token1(),
      ERC20_ABI,
      provider
    ).balanceOf(positionManagerAddress);

    tokenBalance0 = BigNumber.from(amount0).add(contractBalanceT0);

    tokenBalance1 = BigNumber.from(amount1).add(contractBalanceT1);

    console.log("tokenBalance0 actual balance", tokenBalance0.toString());
    console.log("tokenBalance1 actual balance", tokenBalance1.toString());

    // Convert amount0, amount1 to USD (here we use stable coins for testing so we can skip)
    amount0USD = await getTokenUsdValue(
      await positionWrapper.token0(),
      priceOracleAddress,
      tokenBalance0
    );

    amount1USD = await getTokenUsdValue(
      await positionWrapper.token1(),
      priceOracleAddress,
      tokenBalance1
    );
  }

  return { tokenBalance0, tokenBalance1, amount0USD, amount1USD };
}

export async function getCurrentRatio(
  position,
  priceOracleAddress,
  amountCalculationsAddress
) {
  const amountCalculationsAlgebra = new ethers.Contract(
    amountCalculationsAddress,
    AMOUNT_CALCULATIONS_ALGEBRA_ABI,
    provider
  );

  const positionWrapper = new ethers.Contract(
    position,
    POSITION_WRAPPER_ABI,
    provider
  );

  // Get amounts for new price range (to calculate the ratio)
  let amounts =
    await amountCalculationsAlgebra.callStatic.getRatioAmountsForTicks(
      position,
      await positionWrapper.initialTickLower(),
      await positionWrapper.initialTickUpper()
    );

  // Convert amount0, amount1 to USD (here we use stable coins for testing so we can skip)
  let amount0USD = await getTokenUsdValue(
    await positionWrapper.token0(),
    priceOracleAddress,
    BigNumber.from(amounts.amount0).toString()
  );

  let amount1USD = await getTokenUsdValue(
    await positionWrapper.token1(),
    priceOracleAddress,
    BigNumber.from(amounts.amount1).toString()
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

  const portfolio = new ethers.Contract(
    portfolioAddress,
    PORTFOLIO_ABI,
    provider
  );
  const tokens = await portfolio.getTokens();

  const config = await portfolio.assetManagementConfig();

  const assetManagementConfig = new ethers.Contract(
    config,
    ASSET_MANAGEMENT_CONFIG_ABI,
    provider
  );

  let positionManagerAddress =
    await assetManagementConfig.lastDeployedPositionManager();

  if (positionManagerAddress != undefined) {
    const positionManager = new ethers.Contract(
      positionManagerAddress,
      POSITION_MANAGER_ALGEBRA_ABI,
      provider
    );

    const externalPositionStorage = new ethers.Contract(
      await positionManager.externalPositionStorage(),
      EXTERNAL_POSITION_STORAGE_ABI,
      provider
    );

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
        const positionWrapper = new ethers.Contract(
          tokens[i],
          POSITION_WRAPPER_ABI,
          provider
        );
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
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const postUrl = "https://api.enso.finance/api/v1/shortcuts/route?";

  console.log("params", params);

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
  const priceOracle = new ethers.Contract(
    priceOracleAddress,
    PRICE_ORACLE_ABI,
    provider
  );

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

// Helper function to test swap amount calculations with precision
export function testSwapAmountCalculationPrecise() {
  console.log("=== Testing Swap Amount Calculation with Full Precision ===");

  // Example 1: Buy token0 (swap token1 for token0)
  // Current: 50/50, Desired: 70/30
  console.log("\n--- Example 1: Buy token0 ---");
  const feeAmount0USD_1 = BigNumber.from("500000000000000000000"); // 500 token0
  const feeAmount1USD_1 = BigNumber.from("500000000000000000000"); // 500 token1
  const desiredAmount0USD_1 = BigNumber.from("700000000000000000000"); // 700 token0
  const desiredAmount1USD_1 = BigNumber.from("300000000000000000000"); // 300 token1

  const result1 = getSwapInfoToDesiredRatioBN(
    feeAmount0USD_1,
    feeAmount1USD_1,
    desiredAmount0USD_1,
    desiredAmount1USD_1,
    "0x0000000000000000000000000000000000000001", // token0
    "0x0000000000000000000000000000000000000002" // token1
  );

  console.log("Current: 500 token0, 500 token1 (50/50)");
  console.log("Desired: 700 token0, 300 token1 (70/30)");
  console.log("Action: Buy token0 (swap token1 for token0)");
  console.log("Swap Amount:", result1.swapAmount.toString());
  console.log("Token In:", result1.tokenIn);
  console.log("Token Out:", result1.tokenOut);
  console.log(
    `Expected ratio after swap: ${result1.expectedRatioAfterSwap.token0Percent}% token0, ${result1.expectedRatioAfterSwap.token1Percent}% token1`
  );

  // Example 2: Buy token1 (swap token0 for token1)
  // Current: 70/30, Desired: 30/70
  console.log("\n--- Example 2: Buy token1 ---");
  const feeAmount0USD_2 = BigNumber.from("700000000000000000000"); // 700 token0
  const feeAmount1USD_2 = BigNumber.from("300000000000000000000"); // 300 token1
  const desiredAmount0USD_2 = BigNumber.from("300000000000000000000"); // 300 token0
  const desiredAmount1USD_2 = BigNumber.from("700000000000000000000"); // 700 token1

  const result2 = getSwapInfoToDesiredRatioBN(
    feeAmount0USD_2,
    feeAmount1USD_2,
    desiredAmount0USD_2,
    desiredAmount1USD_2,
    "0x0000000000000000000000000000000000000001", // token0
    "0x0000000000000000000000000000000000000002" // token1
  );

  console.log("Current: 700 token0, 300 token1 (70/30)");
  console.log("Desired: 300 token0, 700 token1 (30/70)");
  console.log("Action: Buy token1 (swap token0 for token1)");
  console.log("Swap Amount:", result2.swapAmount.toString());
  console.log("Token In:", result2.tokenIn);
  console.log("Token Out:", result2.tokenOut);
  console.log(
    `Expected ratio after swap: ${result2.expectedRatioAfterSwap.token0Percent}% token0, ${result2.expectedRatioAfterSwap.token1Percent}% token1`
  );

  // Example 3: Small precision test
  console.log("\n--- Example 3: Small Precision Test ---");
  const feeAmount0USD_3 = BigNumber.from("749294974000000000000"); // 749.294974 token0
  const feeAmount1USD_3 = BigNumber.from("250705026000000000000"); // 250.705026 token1
  const desiredAmount0USD_3 = BigNumber.from("750000000000000000000"); // 750 token0
  const desiredAmount1USD_3 = BigNumber.from("250000000000000000000"); // 250 token1

  const result3 = getSwapInfoToDesiredRatioBN(
    feeAmount0USD_3,
    feeAmount1USD_3,
    desiredAmount0USD_3,
    desiredAmount1USD_3,
    "0x0000000000000000000000000000000000000001", // token0
    "0x0000000000000000000000000000000000000002" // token1
  );

  console.log("Current: 749.294974 token0, 250.705026 token1");
  console.log("Desired: 750 token0, 250 token1");
  console.log(
    "Action:",
    result3.swapAmount.gt(0) ? "Small adjustment" : "No swap needed"
  );
  console.log("Swap Amount:", result3.swapAmount.toString());
  console.log("Token In:", result3.tokenIn);
  console.log("Token Out:", result3.tokenOut);
  console.log(
    `Expected ratio after swap: ${result3.expectedRatioAfterSwap.token0Percent}% token0, ${result3.expectedRatioAfterSwap.token1Percent}% token1`
  );

  // Example 4: Very small values
  console.log("\n--- Example 4: Very Small Values ---");
  const feeAmount0USD_4 = BigNumber.from("1000000000000000000"); // 1 token0
  const feeAmount1USD_4 = BigNumber.from("1000000000000000000"); // 1 token1
  const desiredAmount0USD_4 = BigNumber.from("1500000000000000000"); // 1.5 token0
  const desiredAmount1USD_4 = BigNumber.from("500000000000000000"); // 0.5 token1

  const result4 = getSwapInfoToDesiredRatioBN(
    feeAmount0USD_4,
    feeAmount1USD_4,
    desiredAmount0USD_4,
    desiredAmount1USD_4,
    "0x0000000000000000000000000000000000000001", // token0
    "0x0000000000000000000000000000000000000002" // token1
  );

  console.log("Current: 1 token0, 1 token1 (50/50)");
  console.log("Desired: 1.5 token0, 0.5 token1 (75/25)");
  console.log("Action: Buy token0 (swap token1 for token0)");
  console.log("Swap Amount:", result4.swapAmount.toString());
  console.log("Token In:", result4.tokenIn);
  console.log("Token Out:", result4.tokenOut);
  console.log(
    `Expected ratio after swap: ${result4.expectedRatioAfterSwap.token0Percent}% token0, ${result4.expectedRatioAfterSwap.token1Percent}% token1`
  );

  // Example 5: Real fee values
  console.log("\n--- Example 5: Real Fee Values ---");
  const feeAmount0USD_5 = BigNumber.from("732079299086489"); // Real fee token0
  const feeAmount1USD_5 = BigNumber.from("3653728309484992"); // Real fee token1
  const desiredAmount0USD_5 = BigNumber.from("1000000000000000000"); // 1 token0 (desired)
  const desiredAmount1USD_5 = BigNumber.from("1000000000000000000"); // 1 token1 (desired)

  const result5 = getSwapInfoToDesiredRatioBN(
    feeAmount0USD_5,
    feeAmount1USD_5,
    desiredAmount0USD_5,
    desiredAmount1USD_5,
    "0x0000000000000000000000000000000000000001", // token0
    "0x0000000000000000000000000000000000000002" // token1
  );

  console.log("Current: 732079299086489 token0, 3653728309484992 token1");
  console.log(
    "Desired: 1000000000000000000 token0, 1000000000000000000 token1"
  );
  console.log(
    "Action:",
    result5.swapAmount.gt(0) ? "Real fee adjustment" : "No swap needed"
  );
  console.log("Swap Amount:", result5.swapAmount.toString());
  console.log("Token In:", result5.tokenIn);
  console.log("Token Out:", result5.tokenOut);
  console.log(
    `Expected ratio after swap: ${result5.expectedRatioAfterSwap.token0Percent}% token0, ${result5.expectedRatioAfterSwap.token1Percent}% token1`
  );

  // Example 6: Micro amounts
  console.log("\n--- Example 6: Micro Amounts ---");
  const feeAmount0USD_6 = BigNumber.from("1000000000000000"); // 0.001 token0
  const feeAmount1USD_6 = BigNumber.from("9000000000000000"); // 0.009 token1
  const desiredAmount0USD_6 = BigNumber.from("5000000000000000"); // 0.005 token0
  const desiredAmount1USD_6 = BigNumber.from("5000000000000000"); // 0.005 token1

  const result6 = getSwapInfoToDesiredRatioBN(
    feeAmount0USD_6,
    feeAmount1USD_6,
    desiredAmount0USD_6,
    desiredAmount1USD_6,
    "0x0000000000000000000000000000000000000001", // token0
    "0x0000000000000000000000000000000000000002" // token1
  );

  console.log("Current: 0.001 token0, 0.009 token1 (10/90)");
  console.log("Desired: 0.005 token0, 0.005 token1 (50/50)");
  console.log(
    "Action:",
    result6.swapAmount.gt(0) ? "Micro adjustment" : "No swap needed"
  );
  console.log("Swap Amount:", result6.swapAmount.toString());
  console.log("Token In:", result6.tokenIn);
  console.log("Token Out:", result6.tokenOut);
  console.log(
    `Expected ratio after swap: ${result6.expectedRatioAfterSwap.token0Percent}% token0, ${result6.expectedRatioAfterSwap.token1Percent}% token1`
  );

  // Example 7: Real values from user
  console.log("\n--- Example 7: Real User Values ---");
  const feeAmount0USD_7 = BigNumber.from("875189502145937"); // Real fee token0 (ETH)
  const feeAmount1USD_7 = BigNumber.from("4129712983430202"); // Real fee token1 (WBNB)
  const desiredAmount0USD_7 = BigNumber.from("1000000000000000000"); // 1 token0 (desired)
  const desiredAmount1USD_7 = BigNumber.from("1000000000000000000"); // 1 token1 (desired)

  const result7 = getSwapInfoToDesiredRatioBN(
    feeAmount0USD_7,
    feeAmount1USD_7,
    desiredAmount0USD_7,
    desiredAmount1USD_7,
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // ETH token0
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" // WBNB token1
  );

  console.log("Current: 875189502145937 ETH, 4129712983430202 WBNB");
  console.log("Desired: 1000000000000000000 ETH, 1000000000000000000 WBNB");
  console.log(
    "Action:",
    result7.swapAmount.gt(0) ? "Real user fee adjustment" : "No swap needed"
  );
  console.log("Swap Amount:", result7.swapAmount.toString());
  console.log("Token In:", result7.tokenIn);
  console.log("Token Out:", result7.tokenOut);
  console.log(
    `Expected ratio after swap: ${result7.expectedRatioAfterSwap.token0Percent}% token0, ${result7.expectedRatioAfterSwap.token1Percent}% token1`
  );

  // Example 8: Real values from user targeting 10% ratio
  console.log("\n--- Example 8: Real User Values (10% Target) ---");
  const feeAmount0USD_8 = BigNumber.from("875189502145937"); // Real fee token0 (ETH)
  const feeAmount1USD_8 = BigNumber.from("4129712983430202"); // Real fee token1 (WBNB)
  const desiredAmount0USD_8 = BigNumber.from("200000000000000000"); // 0.2 token0 (desired for 10%)
  const desiredAmount1USD_8 = BigNumber.from("1800000000000000000"); // 1.8 token1 (desired for 90%)

  const result8 = getSwapInfoToDesiredRatioBN(
    feeAmount0USD_8,
    feeAmount1USD_8,
    desiredAmount0USD_8,
    desiredAmount1USD_8,
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // ETH token0
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" // WBNB token1
  );

  console.log("Current: 875189502145937 ETH, 4129712983430202 WBNB");
  console.log(
    "Desired: 200000000000000000 ETH, 1800000000000000000 WBNB (10/90)"
  );
  console.log(
    "Action:",
    result8.swapAmount.gt(0)
      ? "Real user fee adjustment to 10%"
      : "No swap needed"
  );
  console.log("Swap Amount:", result8.swapAmount.toString());
  console.log("Token In:", result8.tokenIn);
  console.log("Token Out:", result8.tokenOut);
  console.log(
    `Expected ratio after swap: ${result8.expectedRatioAfterSwap.token0Percent}% token0, ${result8.expectedRatioAfterSwap.token1Percent}% token1`
  );

  return {
    result1,
    result2,
    result3,
    result4,
    result5,
    result6,
    result7,
    result8,
  };
}
