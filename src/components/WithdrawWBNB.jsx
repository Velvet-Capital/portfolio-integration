import { useState, useEffect } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI, POSITION_MANAGER_ALGEBRA_ABI, POSITION_WRAPPER_ABI, ASSET_MANAGEMENT_CONFIG_ABI, ENSO_HANDLER_ADDRESS } from '../config/contracts';
import './WithdrawWBNB.css';

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const thenaFactory = "0x306f06c147f064a010530292a1eb6737c3e378e4";
const swapHandler = "0x9a6511194dd912d0Ca4c55712873924fD9A8f4B8";


const WithdrawWBNB = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [percentage, setPercentage] = useState('');
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
      setError('MetaMask is not installed. Please install MetaMask to use this feature.');
      return;
    }

    if (!account) {
      try {
        await connect();
      } catch (err) {
        setError('Failed to connect to MetaMask. Please make sure MetaMask is unlocked and try again.');
        return;
      }
      return;
    }

    if (!percentage || parseFloat(percentage) <= 0 || parseFloat(percentage) > 100) {
      setError('Please enter a valid percentage between 0 and 100');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification('Starting withdrawal process...');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get portfolio contract
      const portfolioContract = new ethers.Contract(
        portfolio.portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );



      // Get position wrapper
      if (!portfolio.positionList || portfolio.positionList.length === 0) {
        throw new Error('No active positions found. Please ensure you have an active position before withdrawing.');
      }

      const position1 = portfolio.positionList[portfolio.positionIndex];
      console.log("Position 1:", position1);

      if (!position1 || position1 === ZERO_ADDRESS) {
        throw new Error('Invalid position address. Please ensure you have an active position before withdrawing.');
      }

      // Attach to AssetManagementConfig
      const assetManagementConfig = new ethers.Contract(
        portfolio.assetManagementConfig,
        ASSET_MANAGEMENT_CONFIG_ABI,
        signer
      );
      console.log("AssetManagementConfig address:", portfolio.assetManagementConfig);

      // Get position manager address
      const positionManagerAddress = await assetManagementConfig.lastDeployedPositionManager();
      console.log("Raw position manager address:", positionManagerAddress);

      if (!positionManagerAddress || positionManagerAddress === ZERO_ADDRESS) {
        throw new Error("Position manager address is zero or undefined");
      }

      // Attach to PositionManager
      const positionManager = new ethers.Contract(
        positionManagerAddress,
        POSITION_MANAGER_ALGEBRA_ABI,
        signer
      );

      const position = new ethers.Contract(
        position1,
        POSITION_WRAPPER_ABI,
        signer
      );
      if (!position) {
        throw new Error('Failed to get position contract');
      }

      // Calculate withdrawal amount based on percentage
      const amountPortfolioToken = await portfolioContract.balanceOf(account);
      if (amountPortfolioToken.isZero()) {
        throw new Error('No portfolio tokens available to withdraw');
      }

      const withdrawalAmount = amountPortfolioToken.mul(ethers.utils.parseUnits(percentage, 2)).div(10000); // Convert percentage to basis points

      console.log("Withdrawal amount:", withdrawalAmount.toString());

      // Execute withdrawal
      setNotification('Executing withdrawal transaction...');
      const withdrawalTx = await portfolioContract.multiTokenWithdrawal(
        withdrawalAmount,
        {
          _factory: thenaFactory,
          _token0: ZERO_ADDRESS,
          _token1: ZERO_ADDRESS,
          _flashLoanToken: ZERO_ADDRESS,
          _bufferUnit: "0",
          _solverHandler: ENSO_HANDLER_ADDRESS,
          _flashLoanAmount: [[0]],
          firstSwapData: [["0x"]],
          secondSwapData: [["0x"]],
          isDexRepayment: false,
          _poolFees: [[0, 0, 0]],
          _swapHandler: swapHandler,
        }, { gasLimit: 1000000 }
      );

      console.log("Waiting for withdrawal transaction...");
      const receiptWithdrawal = await withdrawalTx.wait();
      console.log("Withdrawal transaction mined:", receiptWithdrawal.transactionHash);

      // Decrease liquidity from position
      setNotification('Decreasing liquidity from position...');
      const positionBalance = await position.balanceOf(account);
      if (positionBalance.isZero()) {
        throw new Error('No position balance available');
      }

      const decreaseLiquidityTx = await positionManager.decreaseLiquidity(
        position1,
        positionBalance,
        0,
        0,
        ZERO_ADDRESS,
        await position.token0(),
        await position.token1(),
        0,
        100
      );

      console.log("Waiting for decrease liquidity transaction...");
      const receiptDecreaseLiquidity = await decreaseLiquidityTx.wait();
      console.log("Decrease liquidity transaction mined:", receiptDecreaseLiquidity.transactionHash);

      setSuccess(true);
      setNotification('Withdrawal completed successfully!');
    } catch (err) {
      console.error('Error during withdrawal:', err);
      if (err.code === 4001) {
        setError('Transaction was rejected by user');
      } else if (err.code === -32002) {
        setError('Please check MetaMask for pending transaction');
      } else {
        setError(err.message || 'An error occurred during withdrawal');
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
          MetaMask is not installed. Please install MetaMask to use this feature.
          <br />
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
            Download MetaMask
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="withdraw-wbnb w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold mb-4">Withdraw WBNB</h3>
      <div className="withdraw-input flex flex-col items-center gap-4 w-full">
        <div className="w-full">
          <input
            type="text"
            value={percentage}
            onChange={handlePercentageChange}
            placeholder="Enter percentage (0-100)"
            disabled={loading}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          />
        </div>
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Withdrawing...' : 'Withdraw'}
        </button>
      </div>
      <div className="w-full mt-4">
        {error && <div className="error w-full p-2 bg-red-100 text-red-700 rounded text-center">{error}</div>}
        {success && <div className="success w-full p-2 bg-green-100 text-green-700 rounded text-center">Withdrawal successful!</div>}
        {notification && <div className="notification w-full p-2 bg-blue-100 text-blue-700 rounded text-center">{notification}</div>}
      </div>
    </div>
  );
};

export default WithdrawWBNB; 