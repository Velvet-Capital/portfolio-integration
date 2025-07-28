import { useState } from "react";
import { useMetaMask } from "../contexts/MetaMaskContext";
import { ethers } from "ethers";
import { PORTFOLIO_ABI } from "../config/contracts";
import { PERMIT2_ADDRESS, AllowanceTransfer } from "@uniswap/permit2-sdk";
import "./DepositWBNB.css";
import {
  depositBatchAddress,
  DEPOSIT_BATCH_ABI,
  ASSET_MANAGEMENT_CONFIG_ABI,
  POSITION_MANAGER_ABI,
  VENUS_ASSET_HANDLER_ABI,
  PRICE_ORACLE_ABI,
  ZERO_ADDRESS,
  venusAssetHandlerAddress,
  ERC20_ABI,
  priceOracleAddress,
  tokenBalanceLibraryAddress,
  swapVerificationLibraryAddress,
  AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS,
} from "../config/contracts";
import axios from "axios";
import qs from "qs";
import { createDepositBatchDataWithEnso } from "../config/helper";

// Permit2 ABI
const PERMIT2_ABI = [
  "function allowance(address owner, address token, address spender) view returns (uint160 amount, uint48 expiration, uint48 nonce)",
];

const DepositWBNB = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [amount, setAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");

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
      setError("Please enter a valid amount to deposit");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification("Starting WBNB deposit process...");

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const chainId = (await provider.getNetwork()).chainId;
      const depositBatch = new ethers.Contract(
        depositBatchAddress,
        DEPOSIT_BATCH_ABI,
        signer
      );
      const portfolioContract = new ethers.Contract(
        portfolio.portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );

      const assetManagementConfig = new ethers.Contract(
        await portfolioContract.assetManagementConfig(),
        ASSET_MANAGEMENT_CONFIG_ABI,
        signer
      );
      const minPortfolioTokenHoldingAmount = 10000;
      console.log(
        "minPortfolioTokenHoldingAmount",
        minPortfolioTokenHoldingAmount
      );

      if (ethers.BigNumber.from(amount).lt(minPortfolioTokenHoldingAmount)) {
        setError(
          `Deposit amount must be greater than ${minPortfolioTokenHoldingAmount} wei`
        );
        return;
      }

      // Get portfolio contract
      let depositToken = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
      const {
        reinvestmentSwapInfo: {
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
        },
        ensoCalldata,
      } = await createDepositBatchDataWithEnso(
        priceOracleAddress,
        tokenBalanceLibraryAddress,
        swapVerificationLibraryAddress,
        AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS,
        portfolio.portfolioAddress,
        depositBatchAddress,
        depositToken,
        amount
      );

      console.log({
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
      });

      const depositTx = await depositBatch.multiTokenSwapETHAndTransfer(
        {
          _minMintAmount: 0,
          _depositAmount: amount,
          _target: portfolio.portfolioAddress,
          _depositToken: depositToken,
          _callData: ensoCalldata,
        },
        {
          _positionWrappers: positionWrappers,
          _swapTokens: swapTokens,
          _positionWrapperIndex: positionWrapperIndex,
          _portfolioTokenIndex: portfolioTokenIndex,
          _index0: index0,
          _index1: index1,
          _amount0Min: amountsMin0,
          _amount1Min: amountsMin1,
          _isExternalPosition: isExternalPosition,
          _swapDeployer: swapDeployer,
          _tokenIn: tokensIn,
          _tokenOut: tokensOut,
          _amountIn: swapAmounts,
          _deployer: ZERO_ADDRESS,
          _fee: feeTiers,
        },
        {
          value: amount,
          gasLimit: 10000000,
        }
      );

      setNotification("Waiting for deposit transaction to be mined...");
      await depositTx.wait();

      setNotification("Deposit completed successfully!");
      setSuccess(true);
    } catch (err) {
      console.error("Error during deposit:", err);
      setError(err.message || "Failed to deposit tokens. Please try again.");
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

  const getMinPortfolioTokenHoldingAmount = async (assetManagerAddress) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(
        assetManagerAddress,
        ASSET_MANAGEMENT_CONFIG_ABI,
        provider
      );
      return await contract.minPortfolioTokenHoldingAmount();
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="deposit-wbnb">
      <div className="input-group">
        {/* <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Enter token address"
          className="wbnb-input"
        /> */}
      </div>
      <div className="input-group">
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter BNB amount"
          className="wbnb-input"
        />
        <span className="input-suffix">BNB in wei</span>
      </div>

      <button
        onClick={handleDeposit}
        disabled={loading || !amount}
        className="deposit-button"
      >
        {loading ? "Processing Deposit..." : "Deposit BNB"}
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
