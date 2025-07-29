import { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI, PORTFOLIO_FACTORY_ABI, REBALANCING_ABI, PORTFOLIO_FACTORY_ADDRESS } from '../config/contracts';
import {chainIdToAddresses} from '../config/networkVariables';
import './Borrow.css';

const addresses = chainIdToAddresses[56];

const Borrow = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);

  const handleBorrow = async () => {
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

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification('Starting borrow process...');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      console.log("Starting borrow process...");
      console.log("Portfolio:", portfolio);
      console.log("Portfolio address:", portfolio.portfolioAddress);
      console.log("Rebalancing address:", portfolio.rebalancing);
      console.log("Account:", account);
      console.log("Addresses:", addresses);

      // Get portfolio contract
      const portfolioContract = new ethers.Contract(
        portfolio.portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );

      // Get portfolio factory
      const portfolioFactory = new ethers.Contract(
        PORTFOLIO_FACTORY_ADDRESS,
        PORTFOLIO_FACTORY_ABI,
        signer
      );

      // Get portfolio info
      const portfolioInfo = await portfolioFactory.PortfolioInfolList(2);
      const rebalancingAddress = await portfolioInfo.rebalancing;

      console.log("Rebalancing Address:", rebalancingAddress);

      // Check if portfolio has rebalancing address
      if (!portfolio.rebalancing) {
        throw new Error('Rebalancing address not available in portfolio. Please ensure portfolio is properly initialized.');
      }

      console.log("Rebalancing address:", portfolio.rebalancing);

      // Get rebalancing contract
      const rebalancing = new ethers.Contract(
        portfolio.rebalancing,
        REBALANCING_ABI,
        signer
      );

      // Check if addresses are available
      if (!addresses) {
        throw new Error('Network addresses not available. Please check network configuration.');
      }

      console.log("Network addresses:", addresses);

      // Execute borrow transaction
      const borrowTx = await rebalancing.borrow(
        addresses.vETH_Address,
        [addresses.vBNB_Address],
        addresses.ETH_Address,
        addresses.corePool_controller,
        "100000000000000" // $1,
        ,{gasLimit: 1000000}
      );

      console.log("Waiting for borrow transaction...");
      const receipt = await borrowTx.wait();
      console.log("Borrow transaction mined:", receipt.transactionHash);

      setSuccess(true);
      setNotification('Borrow completed successfully!');
    } catch (err) {
      console.error('Error during borrow:', err);
      if (err.code === 4001) {
        setError('Transaction was rejected by user');
      } else if (err.code === -32002) {
        setError('Please check MetaMask for pending transaction');
      } else {
        setError(err.message || 'An error occurred during borrow');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="borrow">
        <h3>Borrow</h3>
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
    <div className="borrow w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold mb-4">Borrow</h3>
      <div className="borrow-input flex flex-col items-center gap-4 w-full">
        <button
          onClick={handleBorrow}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Borrowing...' : 'Borrow'}
        </button>
      </div>
      <div className="w-full mt-4">
        {error && <div className="error w-full p-2 bg-red-100 text-red-700 rounded text-center">{error}</div>}
        {success && <div className="success w-full p-2 bg-green-100 text-green-700 rounded text-center">Borrow successful!</div>}
        {notification && <div className="notification w-full p-2 bg-blue-100 text-blue-700 rounded text-center">{notification}</div>}
      </div>
    </div>
  );
};

export default Borrow; 