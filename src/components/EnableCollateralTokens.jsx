import { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { REBALANCING_ABI, PORTFOLIO_ABI } from '../config/contracts';
import { chainIdToAddresses } from '../config/networkVariables';
import './EnableCollateralTokens.css';

const addresses = chainIdToAddresses[56];

const EnableCollateralTokens = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [tokenAddresses, setTokenAddresses] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);

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

  const addTokenInput = () => {
    setTokenAddresses([...tokenAddresses, '']);
  };

  const removeTokenInput = (index) => {
    if (tokenAddresses.length > 1) {
      const newAddresses = tokenAddresses.filter((_, i) => i !== index);
      setTokenAddresses(newAddresses);
    }
  };

  const updateTokenAddress = (index, value) => {
    const newAddresses = [...tokenAddresses];
    newAddresses[index] = value;
    setTokenAddresses(newAddresses);
  };

  const handleEnableCollateralTokens = async () => {
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

    if (!portfolio || !portfolio.rebalancing) {
      setError('Portfolio or rebalancing address not available. Please ensure portfolio is properly initialized.');
      return;
    }

    // Filter out empty addresses
    const validAddresses = tokenAddresses.filter(addr => addr.trim() !== '');
    
    if (validAddresses.length === 0) {
      setError('Please provide at least one valid token address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification('Starting collateral token enablement...');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      console.log("Starting enable collateral tokens process...");
      console.log("Portfolio:", portfolio);
      console.log("Rebalancing address:", portfolio.rebalancing);
      console.log("Tokens to enable:", validAddresses);
      console.log("Account:", account);
      console.log("Addresses:", addresses);


      const portfolioContract = new ethers.Contract(
        portfolio.portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );

      // Get rebalancing contract
      const rebalancing = new ethers.Contract(
        portfolio.rebalancing,
        REBALANCING_ABI,
        signer
      );

      // Get vault address
      const vault = await portfolioContract.vault();
      console.log("Vault address:", vault);

      setNotification(`Enabling ${validAddresses.length} tokens as collateral...`);

      // Enable collateral tokens
      const enableTx = await rebalancing.enableCollateralTokens(
        validAddresses,
        addresses.corePool_controller,
        { gasLimit: 1000000 }
      );

      setNotification('Waiting for transaction to be mined...');
      const receipt = await enableTx.wait();
      console.log("Enable collateral tokens transaction mined:", receipt.transactionHash);

      setSuccess(true);
      setTokenAddresses(['']); // Reset to single empty input
      setNotification('Collateral tokens enabled successfully!');
    } catch (err) {
      console.error('Error during enable collateral tokens:', err);
      if (err.code === 4001) {
        setError('Transaction was rejected by user');
      } else if (err.code === -32002) {
        setError('Please check MetaMask for pending transaction');
      } else {
        setError(err.message || 'An error occurred during enable collateral tokens');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="enable-collateral-tokens">
        <h3>Enable Collateral Tokens</h3>
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
    <div className="enable-collateral-tokens w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">Enable Collateral Tokens</h3>
      
      <div className="token-inputs mb-4">
        {tokenAddresses.map((address, index) => (
          <div key={index}>
            <div className="token-input-group flex items-center gap-2 mb-2">
              <select
                value={address}
                onChange={(e) => updateTokenAddress(index, e.target.value)}
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
              {tokenAddresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTokenInput(index)}
                  className="remove-btn px-2 py-2 bg-red-500 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  disabled={loading}
                >
                  ✕
                </button>
              )}
            </div>
            {address && (
              <div className="mt-1 text-xs text-gray-500 ml-2 mb-2">
                Address: {address}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="action-buttons flex flex-col gap-2 mb-4">
        <button
          type="button"
          onClick={addTokenInput}
          className="add-btn w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          disabled={loading}
        >
          + Add Token
        </button>
        
        <button
          onClick={handleEnableCollateralTokens}
          disabled={loading || tokenAddresses.every(addr => addr.trim() === '') || !portfolio?.rebalancing}
          className="enable-btn w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enabling...' : `Enable ${tokenAddresses.filter(addr => addr.trim() !== '').length} Token(s)`}
        </button>
      </div>

      <div className="w-full">
        {error && <div className="error w-full p-2 bg-red-100 text-red-700 rounded text-center mb-2">{error}</div>}
        {success && <div className="success w-full p-2 bg-green-100 text-green-700 rounded text-center mb-2">Collateral tokens enabled successfully!</div>}
        {notification && <div className="notification w-full p-2 bg-blue-100 text-blue-700 rounded text-center">{notification}</div>}
      </div>

      {!portfolio?.rebalancing && (
        <div className="warning w-full p-2 bg-yellow-100 text-yellow-700 rounded text-center mt-2">
          Portfolio rebalancing address not available. Please ensure portfolio is properly initialized.
        </div>
      )}
    </div>
  );
};

export default EnableCollateralTokens; 