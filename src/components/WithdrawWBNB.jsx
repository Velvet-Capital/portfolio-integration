import { useState, useEffect } from "react";
import { useMetaMask } from "../contexts/MetaMaskContext";
import { ethers } from "ethers";
import {
  priceOracleAddress,
  tokenBalanceLibraryAddress,
  swapVerificationLibraryAddress,
  portfolioCalculationsAddress,
  withdrawBatchAddress,
  AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS,
  PORTFOLIO_ABI,
  ASSET_MANAGEMENT_CONFIG_ABI,
  withdrawManagerAddress,
  WITHDRAW_MANAGER_ABI,
} from "../config/contracts";
import "./WithdrawWBNB.css";
import { getWithdrawBatchData } from "../config/helper";
import { chainIdToAddresses } from "../config/networkVariables";
const addresses = chainIdToAddresses[56];

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const thenaFactory = "0x306f06c147f064a010530292a1eb6737c3e378e4";
const ensoHandlerAddress = "0x064d07d417449c253F288A95eeBb62bf9E427DA4";
const tokenToSwapInto = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const swapHandler = "0xB21F98b6B9d7693bc470EE882E83deD2d0ce5F6E";
const swapHandlerV3 = "0xA238B85AeC6785f08d41E9e09357d6d82d381b2B";

const WithdrawWBNB = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [percentage, setPercentage] = useState("");
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);

  useEffect(() => {
    // Check if MetaMask is installed
    const checkMetaMask = () => {
      const isInstalled = window.ethereum && window.ethereum.isMetaMask;
      setIsMetaMaskInstalled(isInstalled);
    };
    checkMetaMask();
  }, []);

  const handlePercentageChange = (e) => {
    const value = e.target.value;
    // Only allow numbers between 0 and 100
    if (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 100) {
      setPercentage(value);
    }
  };

  const handleWithdraw = async () => {
    if (!isMetaMaskInstalled) {
      setError(
        "MetaMask is not installed. Please install MetaMask to use this feature."
      );
      return;
    }

    if (!account) {
      try {
        await connect();
      } catch (err) {
        setError(
          "Failed to connect to MetaMask. Please make sure MetaMask is unlocked and try again."
        );
        return;
      }
      return;
    }

    if (
      !percentage ||
      parseFloat(percentage) <= 0 ||
      parseFloat(percentage) > 100
    ) {
      setError("Please enter a valid percentage between 0 and 100");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification("Starting withdrawal process...");

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get portfolio contract
      console.log("portfolio.portfolioAddress", portfolio.portfolioAddress);
      const portfolioContract = new ethers.Contract(
        portfolio.portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );

      // // Get position wrapper
      // if (!portfolio.positionList || portfolio.positionList.length === 0) {
      //   throw new Error('No active positions found. Please ensure you have an active position before withdrawing.');
      // }

      // const position1 = portfolio.positionList[portfolio.positionList.length - 1];
      // console.log("Position 1:", position1);

      // if (!position1 || position1 === ZERO_ADDRESS) {
      //   throw new Error('Invalid position address. Please ensure you have an active position before withdrawing.');
      // }

      // // Attach to AssetManagementConfig
      // const assetManagementConfig = new ethers.Contract(
      //   portfolio.assetManagementConfig,
      //   ASSET_MANAGEMENT_CONFIG_ABI,
      //   signer
      // );
      // console.log("AssetManagementConfig address:", portfolio.assetManagementConfig);

      // // Get position manager address
      // const positionManagerAddress = await assetManagementConfig.lastDeployedPositionManager();
      // console.log("Raw position manager address:", positionManagerAddress);

      // Calculate withdrawal amount based on percentage
      const amountPortfolioToken = await portfolioContract.balanceOf(account);
      if (amountPortfolioToken.isZero()) {
        throw new Error("No portfolio tokens available to withdraw");
      }

      const withdrawalAmount = amountPortfolioToken
        .mul(ethers.utils.parseUnits(percentage, 2))
        .div(10000); // Convert percentage to basis points

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
        flashLoanAmounts,
        poolFees,
        swapTokensFinal,

        flashLoanToken,
        thenaPoolInfo,
        flashLoanProtocolToken,
        bufferUnit,
        flashloanBufferUnit
      } = await getWithdrawBatchData(
        priceOracleAddress,
        tokenBalanceLibraryAddress, // tokenBalanceLibraryAddress
        swapVerificationLibraryAddress,
        portfolioCalculationsAddress, // portfolioCalculationsAddress
        AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS,
        portfolio.portfolioAddress, // portfolioAddress
        tokenToSwapInto,
        withdrawalAmount.toString(), // portfolioTokenWithdrawAmount
        withdrawBatchAddress, // withdrawBatchAddress
        await signer.getAddress()
      );

      console.log("FINAL TX DATA");
      console.log("swapAmounts", swapAmounts);
      console.log("tokensIn", tokensIn);
      console.log("tokensOut", tokensOut);

      await portfolioContract.approve(
        withdrawManagerAddress,
        withdrawalAmount.toString()
      );

      console.log("here");

      console.log("withdrawBatchAddress", withdrawBatchAddress);
      console.log("portfolio.portfolioAddress", WITHDRAW_MANAGER_ABI);
      console.log("signer", signer);

      const withdrawManager = new ethers.Contract(
        withdrawManagerAddress,
        WITHDRAW_MANAGER_ABI,
        signer
      );

      console.log("here2");
      console.log("swapTokens", swapTokens);

      const withdrawalTx = await withdrawManager.withdraw(
        swapTokensFinal,
        portfolio.portfolioAddress,
        tokenToSwapInto,
        withdrawalAmount.toString(),
        ensoCalldata,
        0,
        {
          _factory: thenaPoolInfo._factory,
          _token0: thenaPoolInfo._token0,
          _token1: thenaPoolInfo._token1,
          _flashLoanToken: flashLoanToken,
          _bufferUnit: "280",
          _solverHandler: ensoHandlerAddress,
          _flashLoanAmount: flashLoanAmounts,
          firstSwapData: [["0x"]],
          secondSwapData: [["0x"]],
          _swapHandler: swapHandlerV3,
          _poolFees: poolFees.poolFees,
          isDexRepayment: true,
        },
        {
          _positionWrappers: positionWrappers,
          _amountsMin0: amountsMin0,
          _amountsMin1: amountsMin1,
          _swapDeployer: swapDeployer,
          _tokenIn: tokensIn,
          _tokenOut: tokensOut,
          _amountIn: swapAmounts,
          _fee: feeTiers,
        },
        {
          gasLimit: 10000000,
        }
      );

      console.log("Waiting for withdrawal transaction...");
      const receiptWithdrawal = await withdrawalTx.wait();
      console.log(
        "Withdrawal transaction mined:",
        receiptWithdrawal.transactionHash
      );

      setSuccess(true);
      setNotification("Withdrawal completed successfully!");
    } catch (err) {
      console.error("Error during withdrawal:", err);
      if (err.code === 4001) {
        setError("Transaction was rejected by user");
      } else if (err.code === -32002) {
        setError("Please check MetaMask for pending transaction");
      } else {
        setError(err.message || "An error occurred during withdrawal");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="withdraw-wbnb">
        <h3>Withdraw WBNB</h3>
        <div className="error">
          MetaMask is not installed. Please install MetaMask to use this
          feature.
          <br />
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download MetaMask
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="withdraw-wbnb">
      <h3>Withdraw WBNB</h3>
      <div className="withdraw-input">
        <input
          type="text"
          value={percentage}
          onChange={handlePercentageChange}
          placeholder="Enter percentage (0-100)"
          disabled={loading}
        />
        <button
          onClick={handleWithdraw}
          disabled={loading}
        >
          {loading ? "Withdrawing..." : "Withdraw"}
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Withdrawal successful!</div>}
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default WithdrawWBNB;
