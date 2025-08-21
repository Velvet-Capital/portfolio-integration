import { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI, PORTFOLIO_FACTORY_ABI, REBALANCING_ABI, PORTFOLIO_FACTORY_ADDRESS } from '../config/contracts';
import {chainIdToAddresses} from '../config/networkVariables';
import EnableCollateralTokens from './EnableCollateralTokens';
import CollateralStatus from './CollateralStatus';
import './Borrow.css';

const addresses = chainIdToAddresses[56];

const Borrow = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);

  // New state for user inputs
  const [collateralTokens, setCollateralTokens] = useState(['']);
  const [borrowToken, setBorrowToken] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');

  // Available tokens for borrowing (vTokens)
  const availableBorrowTokens = [
    { value: addresses.vETH_Address, label: 'vETH_Address', address: addresses.vETH_Address },
    { value: addresses.vBNB_Address, label: 'vBNB_Address', address: addresses.vBNB_Address },
    { value: addresses.vUSDT_Address, label: 'vUSDT_Address', address: addresses.vUSDT_Address },
    { value: addresses.vDAI_Address, label: 'vDAI_Address', address: addresses.vDAI_Address },
    { value: addresses.vBTC_Address, label: 'vBTC_Address', address: addresses.vBTC_Address },
    { value: addresses.vDOGE_Address, label: 'vDOGE_Address', address: addresses.vDOGE_Address },
    { value: addresses.vLINK_Address, label: 'vLINK_Address', address: addresses.vLINK_Address },
    { value: addresses.vUSDC_Address, label: 'vUSDC_Address', address: addresses.vUSDC_Address },
  ];

  // Available tokens for collateral (vTokens)
  const availableCollateralTokens = [
    { value: addresses.vETH_Address, label: 'vETH_Address', address: addresses.vETH_Address },
    { value: addresses.vBNB_Address, label: 'vBNB_Address', address: addresses.vBNB_Address },
    { value: addresses.vUSDT_Address, label: 'vUSDT_Address', address: addresses.vUSDT_Address },
    { value: addresses.vDAI_Address, label: 'vDAI_Address', address: addresses.vDAI_Address },
    { value: addresses.vBTC_Address, label: 'vBTC_Address', address: addresses.vBTC_Address },
    { value: addresses.vDOGE_Address, label: 'vDOGE_Address', address: addresses.vDOGE_Address },
    { value: addresses.vLINK_Address, label: 'vLINK_Address', address: addresses.vLINK_Address },
    { value: addresses.vUSDC_Address, label: 'vUSDC_Address', address: addresses.vUSDC_Address },
  ];

  const addCollateralToken = () => {
    setCollateralTokens([...collateralTokens, '']);
  };

  const removeCollateralToken = (index) => {
    if (collateralTokens.length > 1) {
      const newTokens = collateralTokens.filter((_, i) => i !== index);
      setCollateralTokens(newTokens);
    }
  };

  const updateCollateralToken = (index, value) => {
    const newTokens = [...collateralTokens];
    newTokens[index] = value;
    setCollateralTokens(newTokens);
  };

  const validateAddress = (address) => {
    return ethers.utils.isAddress(address) && address.length === 42;
  };

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

    // Validate inputs
    if (!borrowToken) {
      setError('Please select a token to borrow.');
      return;
    }

    const validCollateralTokens = collateralTokens.filter(token => token.trim() !== '');
    if (validCollateralTokens.length === 0) {
      setError('Please provide at least one collateral token.');
      return;
    }

    // Validate collateral token addresses
    const invalidCollateralTokens = validCollateralTokens.filter(token => !validateAddress(token));
    if (invalidCollateralTokens.length > 0) {
      setError(`Invalid collateral token addresses: ${invalidCollateralTokens.join(', ')}`);
      return;
    }

    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      setError('Please enter a valid borrow amount.');
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
      console.log("Pool Controller:", addresses.corePool_controller);
      console.log("Collateral Tokens:", validCollateralTokens);
      console.log("Borrow Token:", borrowToken);
      console.log("Borrow Amount:", borrowAmount);

      // Check if portfolio has rebalancing address
      if (!portfolio.rebalancing) {
        throw new Error('Rebalancing address not available in portfolio. Please ensure portfolio is properly initialized.');
      }

      // Get rebalancing contract
      const rebalancing = new ethers.Contract(
        portfolio.rebalancing,
        REBALANCING_ABI,
        signer
      );

      // Convert borrow amount to wei (assuming 18 decimals)
      const borrowAmountWei = ethers.utils.parseEther(borrowAmount);

      setNotification(`Borrowing ${borrowAmount} tokens...`);

      console.log("Borrow amount in wei:", borrowAmountWei.toString());
      console.log("Borrow token:", borrowToken);
      console.log("Valid collateral tokens:", validCollateralTokens);
      console.log("Underlying token:", getUnderlyingToken(borrowToken));
      console.log("Pool controller:", addresses.corePool_controller);
      console.log("Borrow amount in wei:", borrowAmountWei.toString());

      // Execute borrow transaction with user inputs
      const borrowTx = await rebalancing.borrow(
        borrowToken, // vToken to borrow
        validCollateralTokens, // array of vTokens to use as collateral
        getUnderlyingToken(borrowToken), // underlying token address
        addresses.corePool_controller, // selected pool controller
        borrowAmountWei.toString(), // borrow amount in wei
        { gasLimit: 2500000 }
      );

      console.log("Waiting for borrow transaction...");
      const receipt = await borrowTx.wait();
      console.log("Borrow transaction mined:", receipt.transactionHash);

      setSuccess(true);
      setNotification('Borrow completed successfully!');
      
      // Reset form
      setCollateralTokens(['']);
      setBorrowToken('');
      setBorrowAmount('');
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

  // Helper function to get underlying token address from vToken
  const getUnderlyingToken = (vTokenAddress) => {
    const tokenMap = {
      [addresses.vETH_Address]: addresses.ETH_Address,
      [addresses.vBNB_Address]: addresses.WBNB,
      [addresses.vUSDT_Address]: addresses.USDT,
      [addresses.vDAI_Address]: addresses.DAI_Address,
      [addresses.vBTC_Address]: addresses.BTC_Address,
      [addresses.vDOGE_Address]: addresses.DOGE_Address,
      [addresses.vLINK_Address]: addresses.LINK_Address,
      [addresses.vUSDC_Address]: addresses.USDC_Address,
    };
    return tokenMap[vTokenAddress] || vTokenAddress;
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
    <div className="borrow w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">Borrow</h3>
      


      {/* Collateral Tokens */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Collateral Tokens *
        </label>
        {collateralTokens.map((token, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <select
              value={token}
              onChange={(e) => updateCollateralToken(index, e.target.value)}
              disabled={loading}
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select collateral token</option>
              {availableCollateralTokens.map((tokenOption) => (
                <option key={tokenOption.value} value={tokenOption.value}>
                  {tokenOption.label}
                </option>
              ))}
            </select>
            {collateralTokens.length > 1 && (
              <button
                type="button"
                onClick={() => removeCollateralToken(index)}
                className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addCollateralToken}
          className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          disabled={loading}
        >
          + Add Collateral Token
        </button>
      </div>

      {/* Token to Borrow */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Token to Borrow *
        </label>
        <select
          value={borrowToken}
          onChange={(e) => setBorrowToken(e.target.value)}
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select token to borrow</option>
          {availableBorrowTokens.map((token) => (
            <option key={token.value} value={token.value}>
              {token.label}
            </option>
          ))}
        </select>
        {borrowToken && (
          <div className="mt-1 text-xs text-gray-500">
            Address: {borrowToken}
          </div>
        )}
      </div>

      {/* Borrow Amount */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Borrow Amount *
        </label>
        <input
          type="number"
          value={borrowAmount}
          onChange={(e) => setBorrowAmount(e.target.value)}
          placeholder="Enter amount to borrow"
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="0"
          step="0.000001"
        />
      </div>

      {/* Borrow Button */}
      <div className="borrow-input flex flex-col items-center gap-4 w-full">
        <button
          onClick={handleBorrow}
          disabled={loading || !borrowToken || !borrowAmount || collateralTokens.every(token => token.trim() === '')}
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
      
      {/* Collateral Status Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <CollateralStatus portfolio={portfolio} />
      </div>

      {/* Enable Collateral Tokens Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <EnableCollateralTokens portfolio={portfolio} />
      </div>
    </div>
  );
};

export default Borrow; 