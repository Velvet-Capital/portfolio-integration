import { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI } from '../config/contracts';
import { PERMIT2_ADDRESS, AllowanceTransfer } from "@uniswap/permit2-sdk";
import './DepositWBNB.css';
import { depositBatchAddress, DEPOSIT_BATCH_ABI, ASSET_MANAGEMENT_CONFIG_ABI, POSITION_MANAGER_ABI, VENUS_ASSET_HANDLER_ABI, priceOracleAddress, PRICE_ORACLE_ABI, ZERO_ADDRESS,venusAssetHandlerAddress, ERC20_ABI } from '../config/contracts';
import axios from 'axios';
import qs from 'qs';


// Permit2 ABI
const PERMIT2_ABI = [
  "function allowance(address owner, address token, address spender) view returns (uint160 amount, uint48 expiration, uint48 nonce)"
];

const DepositWBNB = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [amount, setAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');

  const toDeadline = (expiration) => {
    return Math.floor((Date.now() + expiration) / 1000);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleDeposit = async () => {
    if (!account) {
      await connect();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount to deposit');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification('Starting WBNB deposit process...');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const chainId = (await provider.getNetwork()).chainId;

      // Get portfolio contract
      console.log("Portfolio Address:", portfolio.portfolioAddress);
      const portfolioContract = new ethers.Contract(
        portfolio.portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );

      const tokens = await portfolioContract.getTokens();
      console.log("Tokens:", tokens);

      const depositTokens = await portfolioContract.getTokens();
      setNotification(`Found ${depositTokens.length} tokens to deposit`);

      const depositBatch = new ethers.Contract(depositBatchAddress, DEPOSIT_BATCH_ABI, signer);

      const config = await portfolioContract.assetManagementConfig();
      const assetManagementConfig = new ethers.Contract(config, ASSET_MANAGEMENT_CONFIG_ABI, signer);

      let positionManagerAddress =
        await assetManagementConfig.lastDeployedPositionManager();
      console.log("Position Manager Address:", positionManagerAddress);

      const positionManager = new ethers.Contract(positionManagerAddress, POSITION_MANAGER_ABI, signer);

      let swapTokens = [];
      let positionWrapperIndex = [];
      let positionWrappers = [];
      let portfolioTokenIndex = [];
      let isExternalPosition = [];
      let isTokenExternalPosition = [];
      let index0 = [];
      let index1 = [];
      let amount0Min = [];
      let amount1Min = [];
      let fee = [];
      let swapDeployer = [];
      let tokenIn = [];
      let tokenOut = [];
      let amountIn = [];

      if (isValidAddress(positionManagerAddress)) {
        console.log("In Valid Address");
      } else {
        swapTokens = tokens;
        for (let i = 0; i < tokens.length; i++) {
          portfolioTokenIndex.push(i);
        }
        // positionWrapperIndex.push(0);
        // positionWrappers.push(ZERO_ADDRESS);
        isExternalPosition = Array(tokens.length).fill(false);
        // isTokenExternalPosition.push(false);
        // index0.push(0);
        // index1.push(0);
        // amount0Min.push(0);
        // amount1Min.push(0);
        // fee.push(0);
        // swapDeployer.push(ZERO_ADDRESS);
        // tokenIn.push(ZERO_ADDRESS);
        // tokenOut.push(ZERO_ADDRESS);
        // amountIn.push(0);
      }
      console.log("here");
      const totalSupply = await portfolioContract.totalSupply();
      console.log("Total Supply:", totalSupply);
      let depositAmounts = [];
      let postResponse = [];

      if (totalSupply.gt(0)) {
        const vault = await portfolioContract.vault();
        depositAmounts = await calculateWeightedDepositAmounts(
          portfolioContract,
          tokens,
          vault,
          amount,
          signer
        );
      } else {
        console.log("Total Supply:", totalSupply);
        depositAmounts = divideAmountEqually(amount, tokens.length);
        console.log(depositAmounts);
      }

      for (let i = 0; i < tokens.length; i++) {
        let response = await createEnsoCallDataRoute(
          depositBatch.address,
          depositBatch.address,
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          tokens[i],
          depositAmounts[i].toString()
        );
        postResponse.push(response.data.tx.data);
        await sleep(500);
      }

      console.log("------------- Executing Deposit Batch -------------");

      // Execute deposit
      setNotification('Executing deposit transaction...');

      const depositTx = await depositBatch.connect(signer).multiTokenSwapETHAndTransfer(
        {
          _minMintAmount: 0,
          _depositAmount: amount.toString(),
          _target: portfolioContract.address,
          _depositToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          _callData: postResponse,
        },
        {
          // Except Swap Tokens, Other Parameters are not used until we have a position manager
          _positionWrappers: positionWrappers,
          _swapTokens: swapTokens,
          _positionWrapperIndex: positionWrapperIndex,
          _portfolioTokenIndex: portfolioTokenIndex,
          _index0: index0,
          _index1: index1,
          _amount0Min: amount0Min,
          _amount1Min: amount1Min,
          _isExternalPosition: isExternalPosition,
          _swapDeployer: swapDeployer,
          _tokenIn: tokenIn,
          _tokenOut: tokenOut,
          _amountIn: amountIn,
          _deployer: ZERO_ADDRESS,
          _fee: fee,
        },
        {
          value: amount.toString(),
          gasLimit: 10000000
        }
      );



      setNotification('Waiting for deposit transaction to be mined...');
      await depositTx.wait();

      
      setNotification('Deposit completed successfully!');
      setSuccess(true);
    } catch (err) {
      console.error('Error during deposit:', err);
      setError(err.message || 'Failed to deposit tokens. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const isValidAddress = (address) => {
    return (
      address !== ZERO_ADDRESS &&
      address.length === 42 && // Ethereum address length
      address.startsWith("0x")
    );
  };

  async function createEnsoCallDataRoute(
    ensoHandler,
    receiver,
    _tokenIn,
    _tokenOut,
    _amountIn
  ) {
    const params = {
      chainId: 56,
      fromAddress: ensoHandler,
      receiver: receiver,
      spender: ensoHandler,
      amountIn: _amountIn,
      slippage: 700,
      tokenIn: _tokenIn,
      tokenOut: _tokenOut,
      routingStrategy: "delegate",
    };

    console.log("params", params);

    const postUrl = "https://api.enso.finance/api/v1/shortcuts/route?";

    const headers = {
      //"Content-Type": "application/json",
      Authorization: import.meta.env.VITE_ENSO_KEY,
    };

    // console.log("URL", postUrl + `${qs.stringify(params)}`, {
    //   headers,
    // });

    return await axios.get(postUrl + `${qs.stringify(params)}`, {
      headers,
    });
  }

  function divideAmountEqually(amount, tokenCount) {
    const amountPerToken = ethers.BigNumber.from(amount).div(tokenCount);
  
    const depositAmounts = new Array(tokenCount).fill(amountPerToken);
    for (let i = 0; i < tokenCount; i++) {
      depositAmounts[i] = amountPerToken;
    }
  
    return depositAmounts;
  }
  

  async function calculateWeightedDepositAmounts(
    portfolio,
    tokens,
    vault,
    depositAmount,
    signer
  ) {

    const oracle = new ethers.Contract(priceOracleAddress, PRICE_ORACLE_ABI, signer);

    const venusAssetHandler = new ethers.Contract(venusAssetHandlerAddress, VENUS_ASSET_HANDLER_ABI, signer);

    // Get comptroller address
    const comptrollerAddress = "0xfD36E2c2a6789Db23113685031d7F16329158384";

    // Get all account data in one call
    const [accountData, tokenAddresses] =
      await venusAssetHandler.callStatic.getUserAccountData(
        vault,
        comptrollerAddress,
        []
      );

    const { lendTokens, borrowTokens } = tokenAddresses;
    const vTokenSet = new Set(lendTokens);

    // Convert totalDebt to 18 decimals (it's in 8 decimals from Venus)
    const totalDebt18Decimals = accountData.totalDebt.mul(
      ethers.BigNumber.from(10).pow(10)
    );

    // Process all tokens in parallel
    const tokenProcessingPromises = tokens.map(async (token, i) => {
      const ERC20 = new ethers.Contract(token, ERC20_ABI, signer);
      const balance = await ERC20.balanceOf(vault);

      if (vTokenSet.has(token)) {
        // It's a vToken
        const underlying = await venusAssetHandler.getUnderlyingToken(token);
        const isCollateral = await venusAssetHandler.isCollateralEnabled(
          token,
          vault,
          comptrollerAddress
        );
        // Calculate underlying amount directly using exchange rate
        const vTokenContract = await ethers.getContractAt("IVenusPool", token);
        const snapshot = await vTokenContract.getAccountSnapshot(vault);

        // Destructure the snapshot result
        const oErr = snapshot[0];
        const vTokenBalance = snapshot[1];
        const borrowBalance = snapshot[2];
        const exchangeRateMantissa = snapshot[3];

        // Calculate the underlying amount: underlyingAmount = vTokenBalance * exchangeRate / 1e18
        const underlyingAmount = balance
          .mul(exchangeRateMantissa)
          .div(ethers.BigNumber.from(10).pow(18));

        const usdValue = await oracle.convertToUSD18Decimals(
          underlying,
          underlyingAmount
        );

        // Return both USD value and collateral status
        return { usdValue, isCollateral, tokenIndex: i };
      } else {
        // Regular token
        const usdValue = await oracle.convertToUSD18Decimals(token, balance);
        return { usdValue, isCollateral: false, tokenIndex: i };
      }
    });

    const tokenResults = await Promise.all(tokenProcessingPromises);

    // Extract USD values in the same order as portfolio.getTokens()
    const tokenUSDValues = tokenResults.map((result) => result.usdValue);

    // Identify collateral tokens by their original indices
    const collateralTokenIndices = tokenResults
      .map((result, i) => (result.isCollateral ? i : -1))
      .filter((i) => i !== -1);

    // Distribute debt among collateral tokens
    const adjustedUSDValues = [...tokenUSDValues];
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
      ethers.BigNumber.from(0)
    );

    const depositAmounts = [];
    for (let i = 0; i < tokens.length; i++) {
      if (totalAdjustedValue.gt(0)) {
        const weight = adjustedUSDValues[i]
          .mul(ethers.BigNumber.from(10).pow(18))
          .div(totalAdjustedValue);
        const tokenDepositAmount = ethers.BigNumber.from(depositAmount)
          .mul(weight)
          .div(ethers.BigNumber.from(10).pow(18));
        depositAmounts.push(tokenDepositAmount);
      } else {
        depositAmounts.push(ethers.BigNumber.from(depositAmount).div(tokens.length));
      }
    }

    console.log("Portfolio Tokens (in order):", tokens);
    console.log(
      "Original USD Values (in order):",
      tokenUSDValues.map((v) => ethers.utils.formatEther(v))
    );
    console.log(
      "Adjusted USD Values (in order):",
      adjustedUSDValues.map((v) => ethers.utils.formatEther(v))
    );
    console.log("Collateral Token Indices:", collateralTokenIndices);
    console.log(
      "Total Debt (18 decimals):",
      ethers.utils.formatEther(totalDebt18Decimals)
    );
    console.log(
      "Deposit Amounts:",
      depositAmounts.map((a) => ethers.utils.formatEther(a))
    );

    return depositAmounts;
  }

  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="deposit-wbnb">
      <div className="input-group">
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Enter token address"
          className="wbnb-input"
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter token amount"
          className="wbnb-input"
        />
        <span className="input-suffix">Tokens</span>
      </div>

      <button
        onClick={handleDeposit}
        disabled={loading || !amount || !tokenAddress}
        className="deposit-button"
      >
        {loading ? 'Processing Deposit...' : 'Deposit Tokens'}
      </button>
      
      {notification && (
        <div className="notification">
          <p>{notification}</p>
        </div>
      )}
      
      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {success && (
        <div className="success">
          <p>Successfully deposited {amount} tokens!</p>
        </div>
      )}
    </div>
  );
};

export default DepositWBNB; 