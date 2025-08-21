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

    const venusAssetHandler = new ethers.Contract(
      venusAssetHandlerAddress,
      VENUS_ASSET_HANDLER_ABI,
      provider
    );

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
        // borrow logic need to confirm this with akarsh
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
  console.log("swapTokens", reinvestmentSwapInfo.swapTokens);
  console.log("finalAmounts", finalAmounts);
  const swapTokens = [];
  const swapAmounts = [];
  const isExternalPosition = [];
  const portfolioTokenIndex = [];
  for(let i = 0; i < reinvestmentSwapInfo.swapTokens.length; i++){
    if(finalAmounts[i] > 0){
      swapTokens.push(reinvestmentSwapInfo.swapTokens[i]);
      swapAmounts.push(finalAmounts[i]);
      isExternalPosition.push(reinvestmentSwapInfo.isExternalPosition[i]);
      portfolioTokenIndex.push(reinvestmentSwapInfo.portfolioTokenIndex[i]);
    }
  }
  reinvestmentSwapInfo.swapTokens = swapTokens;
  reinvestmentSwapInfo.isExternalPosition = isExternalPosition;
  reinvestmentSwapInfo.portfolioTokenIndex = portfolioTokenIndex;

  let ensoCalldata = await createEnsoCalldataDeposit(
    depositBatchAddress,
    depositToken,
    swapTokens,
    swapAmounts
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
    userAddress,
    portfolioTokenWithdrawAmount
  );
  const portfolio = new ethers.Contract(
    portfolioAddress,
    PORTFOLIO_ABI,
    provider
  );
  const vault = await portfolio.vault();

  let swapTokens = reinvestmentSwapInfo.swapTokens;

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
          .mul(portfolioTokenWithdrawAmount)
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
  userAddress,
  portfolioTokenWithdrawAmount
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
      _factory: "0x30055F87716d3DFD0E5198C27024481099fB4A98",
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
        _factory: "0x30055F87716d3DFD0E5198C27024481099fB4A98",
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


  let flashloanBufferUnit =25; //Flashloan buffer unit in 1/10000, extra flashlaon to take, to fulfil the swap(from flashlaon to debt token)
  let bufferUnit = 280; //Buffer unit for collateral amount in 1/100000, extra collateral to take, to fulfil the swap(from collateral underlying to flashlaon token)

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
      portfolioTokenWithdrawAmount,
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
      "1000", // Need to fetch from thena pool
      bufferUnit
    );

  if (values[3].length != 0) {
    if (values[3].length > 1) {
      flashLoanAmounts.push(values[1]);
    } else {
      let borrowedToken = values[3][0]; // In vToken format
      console.log("borrowedToken:", borrowedToken.toString());
      const balanceBorrowed =
        await portfolioCalculations.getVenusTokenBorrowedBalance(
          [borrowedToken],
          vault
        );
      console.log("balanceBorrowed:", balanceBorrowed.toString());
      let borrowed = balanceBorrowed[0]
        .mul(portfolioTokenWithdrawAmount)
        .div(await portfolio.totalSupply());
      flashLoanAmounts.push([borrowed.toString()]);
    }
  }

  console.log("flashLoanAmounts:", flashLoanAmounts);
  flashLoanAmounts.map(amount => console.log("amount:", amount.toString()));
  console.log("AmountToSell:", amountToSell);
  amountToSell.map(amount => console.log("amount:", amount.toString()));

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
  console.log("portfolioTokenWithdrawAmount:", portfolioTokenWithdrawAmount);
  console.log("portfolioAddress:", portfolioAddress);
  console.log("portfolioCalculationsAddress:", portfolioCalculationsAddress);
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
  console.log("here")
  const scale = BigNumber.from("1000000000000000000"); // 1e18
  console.log("scale", scale);
  const MIN_REINVESTMENT_AMOUNT = 1000000;

  // Early exit if no balances
  if (
    (feeAmount0USD.eq(0) && feeAmount1USD.eq(0)) ||
    (feeAmount0USD.lt(ethers.utils.parseEther("1")) &&
      feeAmount1USD.lt(ethers.utils.parseEther("1")))
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

export async function getSwapAmountsForInputExternalPositionRebalance(
  sellPosition,
  sellAmount,
  amountCalculationsAddress,
  ensoHandlerAddress,
  shouldSwap,
  buyTokens
) {
  let sellTokens = [];
  let swapAmounts = [];
  let callData = [];


  const positionWrapper = new ethers.Contract(
    sellPosition,
    POSITION_WRAPPER_ABI,
    provider
  );

  const token0 = await positionWrapper.token0();
  const token1 = await positionWrapper.token1();

  // get withdraw amounts
  // get underlying amounts of position

  const amountCalculationsAlgebra = new ethers.Contract(
    amountCalculationsAddress,
    AMOUNT_CALCULATIONS_ALGEBRA_ABI,
    provider
  );
  let percentage = await amountCalculationsAlgebra.getPercentage(
    sellAmount,
    (await positionWrapper.totalSupply()).toString()
  );

  let withdrawAmounts = await calculateOutputAmounts(
    sellPosition,
    amountCalculationsAddress,
    percentage
  );

  if (withdrawAmounts.token0Amount > 0) {
    swapAmounts.push(BigNumber.from(withdrawAmounts.token0Amount));
    sellTokens.push(token0);
  }

  if (withdrawAmounts.token1Amount > 0) {
    swapAmounts.push(BigNumber.from(withdrawAmounts.token1Amount));
    sellTokens.push(token1);
  }

  let sellTokensFinal = [];
  if (shouldSwap) {
    // create call data for swap
    for (let i = 0; i < sellTokens.length; i++) {
      if (sellTokens[i] != buyTokens[i] && swapAmounts[i].gt(0)) {
        let response = await createEnsoCallDataRoute(
          ensoHandlerAddress,
          ensoHandlerAddress,
          sellTokens[i],
          buyTokens[i],
          swapAmounts[i].toString()
        );
        callData.push(response.data.tx.data);

        sellTokensFinal.push(sellTokens[i]);
      }
    }
  }

  return { sellTokensFinal, swapAmounts, callData };
}

export async function getSwapAmountsForOutputExternalPositionRebalance(
  sellTokens,
  ensoHandlerAddress,
  buyPosition,
  swapAmount,
  shouldSwap,
  amountCalculationsAddress
) {
  const positionWrapper = new ethers.Contract(
    buyPosition,
    POSITION_WRAPPER_ABI,
    provider
  );

  const token0 = await positionWrapper.token0();
  const token1 = await positionWrapper.token1();

  let buyTokens = [];
  let swapAmounts = [];
  let callData = [];

  let depositAmounts = await calculateDepositAmounts(
    buyPosition,
    await positionWrapper.initialTickLower(),
    await positionWrapper.initialTickUpper(),
    swapAmount,
    amountCalculationsAddress
  );

  console.log("depositAmounts", depositAmounts);
  console.log("token0", token0);
  console.log("token1", token1);

  // Always ensure we have amounts for both token0 and token1
  // If we don't swap for a token, its amount will be 0
  const sellToken = sellTokens[0];

  // Initialize amounts for both tokens
  let amount0ForSwap = BigNumber.from(0);
  let amount1ForSwap = BigNumber.from(0);

  let amountsOut = [];


  if (token0 !== sellToken && depositAmounts.amount0 > 0) {
    amount0ForSwap = BigNumber.from(depositAmounts.amount0);
    swapAmounts.push(amount0ForSwap);
    buyTokens.push(token0);
  } else if (token0 === sellToken && depositAmounts.amount0 > 0) {
    amountsOut[0] = depositAmounts.amount0;
  } else {
    amountsOut[0] = "0";
  }
  if (token1 !== sellToken && depositAmounts.amount1 > 0) {
    amount1ForSwap = BigNumber.from(depositAmounts.amount1);
    swapAmounts.push(amount1ForSwap);
    buyTokens.push(token1);
  } else if (token1 === sellToken && depositAmounts.amount1 > 0) {
    amountsOut[1] = depositAmounts.amount1;
  } else {
    amountsOut[1] = "0";
  }

  console.log("swapAmounts", swapAmounts);
  console.log("buyTokens", buyTokens);

  // Always add both tokens to buyTokensFinal with their amounts (0 if not swapped)
  let buyTokensFinal = [];

  buyTokensFinal.push(token0);
  buyTokensFinal.push(token1);

  // Create amountsOut array with amounts for both tokens
  // amountsOut.push(reduceAmount(BigNumber.from(depositAmounts.amount0)));
  // amountsOut.push(reduceAmount(BigNumber.from(depositAmounts.amount1)));

  console.log("amountsOut after reduceAmount", amountsOut);

  // Create call data for swaps
  if (shouldSwap) {
    const sellToken = sellTokens[0];
    for (let i = 0; i < buyTokens.length; i++) {
      if (sellToken != buyTokens[i] && swapAmounts[i].gt(0)) {
        console.log("sellToken", sellToken);
        console.log("buyTokens[i]", buyTokens[i]);
        console.log("swapAmounts[i]", swapAmounts[i]);
        console.log("i", i)
        console.log("how many times is this called?")
        // We need to swap proportional amounts for each token
        const proportionalAmount = swapAmounts[i];

        let response = await createEnsoCallDataRoute(
          ensoHandlerAddress,
          ensoHandlerAddress,
          sellToken,
          buyTokens[i],
          swapAmounts[i].toString()
        );
        callData.push(response.data.tx.data);


        // Use the original calculated amount instead of Enso's inflated amountOut

        if (token0 === buyTokens[i]) {
          amountsOut[0] = response.data.amountOut;
        } else {
          amountsOut[1] = response.data.amountOut;
        }
      }
    }
  }

  return { buyTokensFinal, swapAmounts, callData, amountsOut };
}

export async function calculateDepositAmounts(
  position,
  newTickLower,
  newTickUpper,
  inputAmount,
  amountCalculationsAddress
) {
  // Use existing deployed contract instead of deploying new one
  const amountCalculationsAlgebra = new ethers.Contract(
    amountCalculationsAddress,
    AMOUNT_CALCULATIONS_ALGEBRA_ABI,
    provider
  );

  console.log("newTickLower", newTickLower);
  console.log("newTickUpper", newTickUpper);
  console.log("inputAmount", inputAmount);
  console.log("amountCalculationsAddress", amountCalculationsAddress);
  console.log("position", position);

  // Get amounts for new price range (to calculate the ratio)
  let amounts =
    await amountCalculationsAlgebra.callStatic.getRatioAmountsForTicks(
      position,
      newTickLower,
      newTickUpper
    );

  console.log("amounts", amounts);

  // Use BigNumber arithmetic to maintain precision
  const amount0BN = BigNumber.from(amounts.amount0.toString());
  const amount1BN = BigNumber.from(amounts.amount1.toString());
  console.log("amount0BN", amount0BN);
  console.log("amount1BN", amount1BN);
  const totalAmount = amount0BN.add(amount1BN);
  const inputAmountBN = BigNumber.from(inputAmount.toString());

  // Handle edge case where total is zero - get current ratio from position
  if (totalAmount.eq(0)) {
    // Get the current ratio from the position itself
    const amountCalculationsAlgebraForRatio = new ethers.Contract(
      amountCalculationsAddress,
      AMOUNT_CALCULATIONS_ALGEBRA_ABI,
      provider
    );

    try {
      // Get current amounts in the position to determine ratio
      const currentAmounts =
        await amountCalculationsAlgebraForRatio.callStatic.getLiquidityAmountsForPartialWithdrawal(
          position,
          "10000" // 100% to get the full ratio
        );

      const currentAmount0 = BigNumber.from(currentAmounts.amount0Out || 0);
      const currentAmount1 = BigNumber.from(currentAmounts.amount1Out || 0);
      const currentTotal = currentAmount0.add(currentAmount1);

      if (currentTotal.gt(0)) {
        // Use the current position ratio
        const amount0 = inputAmountBN.mul(currentAmount0).div(currentTotal);
        const amount1 = inputAmountBN.mul(currentAmount1).div(currentTotal);
        return { amount0: amount0.toString(), amount1: amount1.toString() };
      }
    } catch (error) {
      console.log(
        "Could not get current position ratio, falling back to equal split"
      );
    }

    // Final fallback: split equally
    const halfAmount = inputAmountBN.div(2);
    return { amount0: halfAmount.toString(), amount1: halfAmount.toString() };
  }

  // Calculate amounts using BigNumber arithmetic to maintain precision
  const amount0 = inputAmountBN.mul(amount0BN).div(totalAmount);
  const amount1 = inputAmountBN.sub(amount0); // Ensure total equals inputAmount

  return { amount0: amount0.toString(), amount1: amount1.toString() };
}

export async function createEncodedParametersIncreaseLiquidity(
  position,
  sellTokens,
  sellTokenBalances,
  ensoHandlerAddress,
  amountCalculationsAddress,
  dustReceiver,
  priceOracleAddress,
  shouldSwap
) {
  const positionWrapper = new ethers.Contract(
    position,
    POSITION_WRAPPER_ABI,
    provider
  );

  const token1 = await positionWrapper.token0();
  const token0 = await positionWrapper.token1();

  const positionManagerAddress = await positionWrapper.parentPositionManager();
  console.log("sellTokens", sellTokens);
  console.log("sellTokenBalances", sellTokenBalances);
  const { buyTokensFinal, swapAmounts, callData, amountsOut } =
    await getSwapAmountsForOutputExternalPositionRebalance(
      sellTokens,
      ensoHandlerAddress,
      position,
      sellTokenBalances,
      shouldSwap, // can be false if no swap is needed (keep underlying tokens)
      amountCalculationsAddress
    );

  // We can have 1 or 2 swap amounts depending on how many different tokens we're swapping to
  // if (swapAmounts.length === 0) {
  //   throw new Error(`No swap amounts calculated`);
  // }


  // Map amountsOut from Enso swaps back to token0 and token1 amounts
  let amount0FromSwap = BigNumber.from(0);
  let amount1FromSwap = BigNumber.from(0);

  for (let i = 0; i < buyTokensFinal.length; i++) {
    if (buyTokensFinal[i] === token0) {
      amount0FromSwap = BigNumber.from(amountsOut[i]);
    } else if (buyTokensFinal[i] === token1) {
      amount1FromSwap = BigNumber.from(amountsOut[i]);
    }
  }

  // Apply reduceAmount to account for slippage and ensure transaction success
  const amount0ForDeposit = reduceAmount(amount0FromSwap);
  const amount1ForDeposit = reduceAmount(amount1FromSwap);

  console.log('amountsOut', amountsOut);

  const increaseLiquidityAmount0 = reduceAmount(BigNumber.from(amountsOut[0]));
  const increaseLiquidityAmount1 = reduceAmount(BigNumber.from(amountsOut[1]));



  console.log("increaseLiquidityAmount0", increaseLiquidityAmount0);
  console.log("increaseLiquidityAmount1", increaseLiquidityAmount1);

  const callDataIncreaseLiquidity = [[]];
  const increaseLiquidityTarget = [[]]
  // Encode the function call
  let ABIApprove = ["function approve(address spender, uint256 amount)"];
  let abiEncodeApprove = new ethers.utils.Interface(ABIApprove);

  let approvalIndex = 0;

  // Only approve token0 if amount > 0 (use reduced amounts for consistency)
  if (amount0ForDeposit.gt(0)) {
    callDataIncreaseLiquidity[0][approvalIndex] =
      abiEncodeApprove.encodeFunctionData("approve", [
        positionManagerAddress,
        amount0ForDeposit.toString(),
      ]);
    increaseLiquidityTarget[0].push(token0);
    approvalIndex++;
  }

  // Only approve token1 if amount > 0 (use reduced amounts for consistency)
  if (amount1ForDeposit.gt(0)) {
    callDataIncreaseLiquidity[0][approvalIndex] =
      abiEncodeApprove.encodeFunctionData("approve", [
        positionManagerAddress,
        amount1ForDeposit.toString(),
      ]);
    increaseLiquidityTarget[0].push(token1);
    approvalIndex++;
  }

  // Check if this is the first deposit by checking position totalSupply
  const totalSupply = await positionWrapper.totalSupply();
  const isFirstDeposit = totalSupply.eq(0);

  // Set minimum amounts to 0 for now (proper slippage calculation would require token prices)
  const amount0Min = BigNumber.from(0);
  const amount1Min = BigNumber.from(0);

  let ABI = [];
  let functionName = "";
  let functionParams = [];

  if (isFirstDeposit) {
    console.log("isFirstDeposit", isFirstDeposit);
    // First deposit - use initializePositionAndDeposit
    ABI = [
      "function initializePositionAndDeposit(address _dustReceiver, address _positionWrapper, (uint256 _amount0Desired, uint256 _amount1Desired, uint256 _amount0Min, uint256 _amount1Min, address _deployer) params)",
    ];

    functionName = "initializePositionAndDeposit";
    functionParams = [
      dustReceiver, // _dustReceiver
      position, // _positionWrapper
      {
        // Use reduced amounts for consistency with approvals
        _amount0Desired: increaseLiquidityAmount0,
        _amount1Desired: increaseLiquidityAmount1,
        _amount0Min: amount0Min.toString(),
        _amount1Min: amount1Min.toString(),
        _deployer: ethers.constants.AddressZero,
      },
    ];
  } else {
    // Subsequent deposit - use increaseLiquidity
    // Get reinvestment swap info for existing position
    const reinvestmentSwapInfo = await getReinvestmentSwapInfo(
      position,
      priceOracleAddress,
      amountCalculationsAddress
    );

    ABI = [
      "function increaseLiquidity((address _dustReceiver, address _positionWrapper, uint256 _amount0Desired, uint256 _amount1Desired, uint256 _amount0Min, uint256 _amount1Min, address _swapDeployer, address _tokenIn, address _tokenOut, uint256 _amountIn, uint24 _fee) _params)",
    ];

    functionName = "increaseLiquidity";
    functionParams = [
      {
        _dustReceiver: dustReceiver,
        _positionWrapper: position,
        // Use reduced amounts for consistency with approvals
        _amount0Desired: increaseLiquidityAmount0,
        _amount1Desired: increaseLiquidityAmount1,
        _amount0Min: amount0Min.toString(),
        _amount1Min: amount1Min.toString(),
        _swapDeployer: ethers.constants.AddressZero,
        // Use reinvestment swap info for existing position
        _tokenIn: reinvestmentSwapInfo.tokenIn,
        _tokenOut: reinvestmentSwapInfo.tokenOut,
        _amountIn: reinvestmentSwapInfo.swapAmount.toString(),
        _fee: 0,
      },
    ];
  }

  let abiEncode = new ethers.utils.Interface(ABI);

  // Encode the function call at the next index after approvals
  callDataIncreaseLiquidity[0][approvalIndex] = abiEncode.encodeFunctionData(
    functionName,
    functionParams
  );
  console.log("positionManagerAddress", positionManagerAddress);
  increaseLiquidityTarget[0].push(positionManagerAddress);


  const encodedParameters = ethers.utils.defaultAbiCoder.encode(
    [
      "bytes[][]", // callDataEnso
      "bytes[]", // callDataDecreaseLiquidity
      "bytes[][]", // callDataIncreaseLiquidity
      "address[][]", // increaseLiquidityTarget
      "address[]", // underlyingTokensDecreaseLiquidity
      "address[][]", // tokensIn
      "address[][]", // tokensOut
      "uint256[][]", // minExpectedOutputAmounts (out)
    ],
    [
      [callData],
      [],
      callDataIncreaseLiquidity,
      increaseLiquidityTarget,
      [],
      [sellTokens],
      [[position]],
      [[0]],
    ]
  );

  return encodedParameters;
}

export async function createEncodedParametersDecreaseLiquidity(
  sellPosition,
  sellTokenBalance,
  ensoHandlerAddress,
  amountCalculationsAddress,
  dustReceiver,
  priceOracleAddress
) {
  const positionWrapper = new ethers.Contract(
    sellPosition,
    POSITION_WRAPPER_ABI,
    provider
  );

  const token0 = await positionWrapper.token0();
  const token1 = await positionWrapper.token1();

  // Calculate percentage of position being sold
  const amountCalculationsAlgebra = new ethers.Contract(
    amountCalculationsAddress,
    AMOUNT_CALCULATIONS_ALGEBRA_ABI,
    provider
  );

  let percentage = await amountCalculationsAlgebra.getPercentage(
    sellTokenBalance,
    (await positionWrapper.totalSupply()).toString()
  );

  // Calculate underlying token amounts that will be withdrawn
  let withdrawAmounts = await calculateOutputAmounts(
    sellPosition,
    amountCalculationsAddress,
    percentage.toString()
  );

  // Check if we're withdrawing less than total supply (need reinvestment swap info)
  const totalSupply = await positionWrapper.totalSupply();
  const isPartialWithdrawal = BigNumber.from(sellTokenBalance).lt(totalSupply);

  let tokenIn = ethers.constants.AddressZero;
  let tokenOut = ethers.constants.AddressZero;
  let amountIn = BigNumber.from(0);

  if (isPartialWithdrawal) {
    // Get reinvestment swap info for partial withdrawal
    const reinvestmentSwapInfo = await getReinvestmentSwapInfo(
      sellPosition,
      priceOracleAddress,
      amountCalculationsAddress
    );

    tokenIn = reinvestmentSwapInfo.tokenIn;
    tokenOut = reinvestmentSwapInfo.tokenOut;
    amountIn = reinvestmentSwapInfo.swapAmount;
  }

  // Create decrease liquidity call data
  const callDataDecreaseLiquidity = [];
  let ABI = [
    "function decreaseLiquidity(address _positionWrapper, uint256 _withdrawalAmount, uint256 _amount0Min, uint256 _amount1Min, address _swapDeployer, address tokenIn, address tokenOut, uint256 amountIn, uint24 _fee)",
  ];
  let abiEncode = new ethers.utils.Interface(ABI);

  callDataDecreaseLiquidity[0] = abiEncode.encodeFunctionData(
    "decreaseLiquidity",
    [
      sellPosition,
      sellTokenBalance,
      0, // _amount0Min
      0, // _amount1Min
      ethers.constants.AddressZero, // _swapDeployer
      tokenIn,
      tokenOut,
      amountIn.toString(),
      100, // _fee
    ]
  );

  // Prepare underlying tokens array
  const underlyingTokens = [];
  if (withdrawAmounts.token0Amount.gt(0)) {
    underlyingTokens.push(token0);
  }
  if (withdrawAmounts.token1Amount.gt(0)) {
    underlyingTokens.push(token1);
  }

  const encodedParameters = ethers.utils.defaultAbiCoder.encode(
    [
      "bytes[][]", // callDataEnso
      "bytes[]", // callDataDecreaseLiquidity
      "bytes[][]", // callDataIncreaseLiquidity
      "address[][]", // increaseLiquidityTarget
      "address[]", // underlyingTokensDecreaseLiquidity
      "address[][]", // tokensIn
      "address[][]", // tokensOut
      "uint256[][]", // minExpectedOutputAmounts (out)
    ],
    [
      [[]], // Empty callDataEnso (no swaps needed for this basic case)
      callDataDecreaseLiquidity,
      [[]], // Empty callDataIncreaseLiquidity
      [[]], // Empty increaseLiquidityTarget
      underlyingTokens, // Underlying tokens from the position
      [[sellPosition]], // tokensIn - the position being sold
      [underlyingTokens], // tokensOut - underlying tokens being received
      [[0, 0]], // minExpectedOutputAmounts
    ]
  );

  return encodedParameters;
}

export async function createEncodedParametersDecreaseLiquidityWithSwap(
  sellPosition,
  sellTokenBalance,
  buyToken,
  ensoHandlerAddress,
  amountCalculationsAddress,
  dustReceiver
) {
  const positionWrapper = new ethers.Contract(
    sellPosition,
    POSITION_WRAPPER_ABI,
    provider
  );

  const token0 = await positionWrapper.token0();
  const token1 = await positionWrapper.token1();

  // Calculate percentage of position being sold
  const amountCalculationsAlgebra = new ethers.Contract(
    amountCalculationsAddress,
    AMOUNT_CALCULATIONS_ALGEBRA_ABI,
    provider
  );

  let percentage = await amountCalculationsAlgebra.getPercentage(
    sellTokenBalance,
    (await positionWrapper.totalSupply()).toString()
  );

  // Calculate underlying token amounts that will be withdrawn
  let withdrawAmounts = await calculateOutputAmounts(
    sellPosition,
    amountCalculationsAddress,
    percentage.toString()
  );

  // Prepare swap data for underlying tokens to target token
  let callDataEnso = [[]];

  if(withdrawAmounts.token0Amount.gt(0) && token0 !== buyToken) {

    console.log("token0", token0);
    let swapAmount = withdrawAmounts.token0Amount.toString();
    const response0 = await createEnsoCallDataRoute(
      ensoHandlerAddress,
      ensoHandlerAddress,
      token0,
      buyToken,
      swapAmount
    );
    callDataEnso[0].push(response0.data.tx.data);
  }

  if (withdrawAmounts.token1Amount.gt(0) && token1 !== buyToken) {
    console.log("token1", token1);
    let swapAmount = withdrawAmounts.token1Amount.toString();
    const response1 = await createEnsoCallDataRoute(
      ensoHandlerAddress,
      ensoHandlerAddress,
      token1,
      buyToken,
      swapAmount
    );
    callDataEnso[0].push(response1.data.tx.data);
  }

  // Create decrease liquidity call data
  const callDataDecreaseLiquidity = [];
  let ABI = [
    "function decreaseLiquidity(address _positionWrapper, uint256 _withdrawalAmount, uint256 _amount0Min, uint256 _amount1Min, address _swapDeployer, address tokenIn, address tokenOut, uint256 amountIn, uint24 _fee)",
  ];
  let abiEncode = new ethers.utils.Interface(ABI);

  callDataDecreaseLiquidity[0] = abiEncode.encodeFunctionData(
    "decreaseLiquidity",
    [
      sellPosition,
      sellTokenBalance,
      0, // _amount0Min
      0, // _amount1Min
      ethers.constants.AddressZero, // _swapDeployer
      token0, // tokenIn
      token1, // tokenOut
      0, // amountIn
      100, // _fee
    ]
  );

  // Prepare underlying tokens array
  const underlyingTokens = [];
  if (withdrawAmounts.token0Amount.gt(0)) {
    underlyingTokens.push(token0);
  }
  if (withdrawAmounts.token1Amount.gt(0)) {
    underlyingTokens.push(token1);
  }

  const encodedParameters = ethers.utils.defaultAbiCoder.encode(
    [
      "bytes[][]", // callDataEnso
      "bytes[]", // callDataDecreaseLiquidity
      "bytes[][]", // callDataIncreaseLiquidity
      "address[][]", // increaseLiquidityTarget
      "address[]", // underlyingTokensDecreaseLiquidity
      "address[][]", // tokensIn
      "address[][]", // tokensOut
      "uint256[][]", // minExpectedOutputAmounts (out)
    ],
    [
      callDataEnso,
      callDataDecreaseLiquidity,
      [[]], // Empty callDataIncreaseLiquidity
      [[]], // Empty increaseLiquidityTarget
      underlyingTokens, // Underlying tokens from the position
      [[sellPosition]], // tokensIn - the position being sold
      [[buyToken]], // tokensOut - underlying tokens being received
      [[0]], // minExpectedOutputAmounts
    ]
  );

  return encodedParameters;
}


export async function getEncodedDataForPositionLiquidityIncrease(
  position,
  token0Amount,
  token1Amount,
  ensoHandlerAddress,
  amountCalculationsAddress,
  dustReceiver,
  priceOracleAddress,
) {
  const positionWrapper = new ethers.Contract(
    position,
    POSITION_WRAPPER_ABI,
    provider
  );

  const token0 = await positionWrapper.token0();
  const token1 = await positionWrapper.token1();

  let sellTokenBalance0 =  BigNumber.from(token0Amount);
  let sellTokenBalance1 =  BigNumber.from(token1Amount);

  // Get position manager address
  const positionManagerAddress = await positionWrapper.parentPositionManager();
  
  
  // Encode approval function
  let ABIApprove = ["function approve(address spender, uint256 amount)"];
  let abiEncodeApprove = new ethers.utils.Interface(ABIApprove);
  
  // Get sell token balances


  const totalSupply = await positionWrapper.totalSupply();
  const isFirstDeposit = totalSupply.eq(0);

  const amount0Min = BigNumber.from(0);
  const amount1Min = BigNumber.from(0);

  let approvalIndex = 0;
  const callDataIncreaseLiquidity = [[]];
  const increaseLiquidityTarget = [[]]

  console.log("isFirstDeposit", isFirstDeposit);

  if (sellTokenBalance0.gt(0)) {
    callDataIncreaseLiquidity[0][approvalIndex] =
      abiEncodeApprove.encodeFunctionData("approve", [
        positionManagerAddress,
        sellTokenBalance0.toString(),
      ]);
    increaseLiquidityTarget[0].push(token0);
    approvalIndex++;
  }

  // Only approve token1 if amount > 0 (use reduced amounts for consistency)
  if (sellTokenBalance1.gt(0)) {
    callDataIncreaseLiquidity[0][approvalIndex] =
      abiEncodeApprove.encodeFunctionData("approve", [
        positionManagerAddress,
        sellTokenBalance1.toString(),
      ]);
    increaseLiquidityTarget[0].push(token1);
    approvalIndex++;
  }

  let ABI = [];
  let functionName = "";
  let functionParams = [];
  // First position approval and initialization
  if (isFirstDeposit) {
    console.log("isFirstDeposit", isFirstDeposit);
    // First deposit - use initializePositionAndDeposit
    ABI = [
      "function initializePositionAndDeposit(address _dustReceiver, address _positionWrapper, (uint256 _amount0Desired, uint256 _amount1Desired, uint256 _amount0Min, uint256 _amount1Min, address _deployer) params)",
    ];

    functionName = "initializePositionAndDeposit";
    functionParams = [
      dustReceiver, // _dustReceiver
      position, // _positionWrapper
      {
        // Use reduced amounts for consistency with approvals
        _amount0Desired: sellTokenBalance0,
        _amount1Desired: sellTokenBalance1,
        _amount0Min: amount0Min.toString(),
        _amount1Min: amount1Min.toString(),
        _deployer: ethers.constants.AddressZero,
      },
    ];
  } else {
    // Subsequent deposit - use increaseLiquidity
    // Get reinvestment swap info for existing position
    const reinvestmentSwapInfo = await getReinvestmentSwapInfo(
      position,
      priceOracleAddress,
      amountCalculationsAddress
    );

    ABI = [
      "function increaseLiquidity((address _dustReceiver, address _positionWrapper, uint256 _amount0Desired, uint256 _amount1Desired, uint256 _amount0Min, uint256 _amount1Min, address _swapDeployer, address _tokenIn, address _tokenOut, uint256 _amountIn, uint24 _fee) _params)",
    ];

    functionName = "increaseLiquidity";
    functionParams = [
      {
        _dustReceiver: dustReceiver,
        _positionWrapper: position,
        // Use reduced amounts for consistency with approvals
        _amount0Desired: sellTokenBalance0,
        _amount1Desired: sellTokenBalance1,
        _amount0Min: amount0Min.toString(),
        _amount1Min: amount1Min.toString(),
        _swapDeployer: ethers.constants.AddressZero,
        // Use reinvestment swap info for existing position
        _tokenIn: reinvestmentSwapInfo.tokenIn,
        _tokenOut: reinvestmentSwapInfo.tokenOut,
        _amountIn: reinvestmentSwapInfo.swapAmount.toString(),
        _fee: 0,
      },
    ];
  }


  let abiEncode = new ethers.utils.Interface(ABI);

  // Encode the function call at the next index after approvals
  callDataIncreaseLiquidity[0][approvalIndex] = abiEncode.encodeFunctionData(
    functionName,
    functionParams
  );
  console.log("positionManagerAddress", positionManagerAddress);
  increaseLiquidityTarget[0].push(positionManagerAddress);

  
  // Encode the final parameters
  const encodedParameters = ethers.utils.defaultAbiCoder.encode(
    [
      "bytes[][]", // callDataEnso
      "bytes[]", // callDataDecreaseLiquidity
      "bytes[][]", // callDataIncreaseLiquidity
      "address[][]", // increaseLiquidityTarget
      "address[]", // underlyingTokensDecreaseLiquidity
      "address[][]", // tokensIn
      "address[][]", // tokensOut
      "uint256[][]", // minExpectedOutputAmounts (out)
    ],
    [
      [[]],
      [],
      callDataIncreaseLiquidity,
      increaseLiquidityTarget,
      [],
      [[token0,token1]],
      [[position]], 
      [[0]],
    ]
  );
  
  return encodedParameters;
}


export async function getTokenAmountOut(
  position,
  amount,
  isToken0,
  amountCalculationsAddress,
  signer
) {
  const multiplier = "1000000000000000000";
  const amountCalculationsAlgebra = new ethers.Contract(
    amountCalculationsAddress,
    AMOUNT_CALCULATIONS_ALGEBRA_ABI,
    signer
  );

  const ratio = await amountCalculationsAlgebra.callStatic.getRatio(position);
  console.log("ratio", ratio);
  if(isToken0) {
    const amountOut =  BigNumber.from(amount).mul(ratio).div(multiplier);
    return amountOut;
  } else {
    const amountOut =  BigNumber.from(amount).mul(multiplier).div(ratio);
    return amountOut;
  }
}

export async function getEncodedDataForPositionLiquidityDecrease(
  position,
  sellTokenBalance,
  ensoHandlerAddress,
  amountCalculationsAddress,
  dustReceiver,
  priceOracleAddress,
) {

  const positionWrapper = new ethers.Contract(
    position,
    POSITION_WRAPPER_ABI,
    provider
  );

  const token0 = await positionWrapper.token0();
  const token1 = await positionWrapper.token1();

  // Calculate percentage of position being sold
  const amountCalculationsAlgebra = new ethers.Contract(
    amountCalculationsAddress,
    AMOUNT_CALCULATIONS_ALGEBRA_ABI,
    provider
  );

  let percentage = await amountCalculationsAlgebra.getPercentage(
    sellTokenBalance,
    (await positionWrapper.totalSupply()).toString()
  );

  // Calculate underlying token amounts that will be withdrawn
  let withdrawAmounts = await calculateOutputAmounts(
    position,
    amountCalculationsAddress,
    percentage.toString()
  );

  // Prepare swap data for underlying tokens to target token
  let callDataEnso = [[]];

  // Create decrease liquidity call data
  const callDataDecreaseLiquidity = [];
  let ABI = [
    "function decreaseLiquidity(address _positionWrapper, uint256 _withdrawalAmount, uint256 _amount0Min, uint256 _amount1Min, address _swapDeployer, address tokenIn, address tokenOut, uint256 amountIn, uint24 _fee)",
  ];
  let abiEncode = new ethers.utils.Interface(ABI);

  callDataDecreaseLiquidity[0] = abiEncode.encodeFunctionData(
    "decreaseLiquidity",
    [
      position,
      sellTokenBalance,
      0, // _amount0Min
      0, // _amount1Min
      ethers.constants.AddressZero, // _swapDeployer
      token0, // tokenIn
      token1, // tokenOut
      0, // amountIn
      100, // _fee
    ]
  );

  // Prepare underlying tokens array
  const underlyingTokens = [];
  if (withdrawAmounts.token0Amount.gt(0)) {
    underlyingTokens.push(token0);
  }
  if (withdrawAmounts.token1Amount.gt(0)) {
    underlyingTokens.push(token1);
  }

  const encodedParameters = ethers.utils.defaultAbiCoder.encode(
    [
      "bytes[][]", // callDataEnso
      "bytes[]", // callDataDecreaseLiquidity
      "bytes[][]", // callDataIncreaseLiquidity
      "address[][]", // increaseLiquidityTarget
      "address[]", // underlyingTokensDecreaseLiquidity
      "address[][]", // tokensIn
      "address[][]", // tokensOut
      "uint256[][]", // minExpectedOutputAmounts (out)
    ],
    [
      callDataEnso,
      callDataDecreaseLiquidity,
      [[]], // Empty callDataIncreaseLiquidity
      [[]], // Empty increaseLiquidityTarget
      underlyingTokens, // Underlying tokens from the position
      [[position]], // tokensIn - the position being sold
      [[token0,token1]], // tokensOut - underlying tokens being received
      [[0,0]], // minExpectedOutputAmounts
    ]
  );

  return encodedParameters;
} 