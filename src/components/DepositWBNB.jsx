import { useState } from "react";
import { useMetaMask } from "../contexts/MetaMaskContext";
import { ethers } from "ethers";
import { BigNumber } from "ethers";
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
  depositManagerAddress,
  DEPOSIT_MANAGER_ABI,
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

  const handleTokenAddressChange = (e) => {
    const value = e.target.value;
    setTokenAddress(value);
  };

  const handleDeposit = async () => {
    console.log("handleDeposit__________________________________");
    console.log("portfolio:", portfolio);
    console.log("account:", account);
    console.log("amount:", amount);
    console.log("tokenAddress:", tokenAddress);
    
    if (!account) {
      console.log("No account, connecting...");
      await connect();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount to deposit");
      return;
    }

    if (!tokenAddress) {
      setError("Please enter a token address");
      return;
    }

    if (!portfolio || !portfolio.portfolioAddress) {
      setError("Portfolio information is missing");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification("Starting WBNB deposit process...");

    try {
      console.log("account__________________________________", account);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("signer__________________________________", signer);
      const chainId = (await provider.getNetwork()).chainId;
      console.log("chainId:", chainId);
      
      const depositBatch = new ethers.Contract(
        depositBatchAddress,
        DEPOSIT_BATCH_ABI,
        signer
      );

      const depositManager = new ethers.Contract(
        depositManagerAddress,
        DEPOSIT_MANAGER_ABI,
        signer
      );

      const depositAmountInWei = ethers.utils.parseEther(amount);

      console.log("tokenAddress", tokenAddress);
      console.log("depositAmountInWei", depositAmountInWei.toString());

      let depositToken;
      if (tokenAddress === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
        depositToken = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
      } else {
        depositToken = tokenAddress;
      }

      console.log("depositToken", depositToken);

      setNotification("Creating deposit batch data...");
      
      try {
        // Get portfolio contract
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
          depositAmountInWei
        );

        console.log("createDepositBatchDataWithEnso completed successfully");
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

        let depositTx;

        if (depositToken === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
          setNotification("Executing ETH deposit transaction...");
          depositTx = await depositBatch.multiTokenSwapETHAndTransfer(
            {
              _minMintAmount: 0,
              _depositAmount: depositAmountInWei,
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
              value: depositAmountInWei,
              gasLimit: 10000000,
            }
          );
        } else {
          setNotification("Executing token deposit transaction...");
          depositTx = await depositManager.deposit(
            {
              _minMintAmount: 0,
              _depositAmount: depositAmountInWei,
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
              gasLimit: 10000000,
            }
          );
        }

        setNotification("Waiting for deposit transaction to be mined...");
        await depositTx.wait();

        setNotification("Deposit completed successfully!");
        setSuccess(true);
      } catch (helperError) {
        console.error("Error in createDepositBatchDataWithEnso:", helperError);
        setError(`Error preparing deposit data: ${helperError.message}`);
        throw helperError;
      }
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
        <input
          type="text"
          value={tokenAddress}
          onChange={handleTokenAddressChange}
          placeholder="Enter token address"
          className="wbnb-input"
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter BNB amount"
          className="wbnb-input"
        />
        <span className="input-suffix">BNB</span>
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
