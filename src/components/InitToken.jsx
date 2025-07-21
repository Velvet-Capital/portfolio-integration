import React, { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI } from '../config/contracts';
import './InitToken.css';

const InitToken = ({ portfolioAddress, loadPortfolio }) => {
  const { account } = useMetaMask();
  const [tokenAddresses, setTokenAddresses] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);

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

  const validateAddress = (address) => {
    return ethers.utils.isAddress(address) && address.length === 42;
  };

  const initTokens = async () => {
    // Filter out empty addresses and validate
    const validAddresses = tokenAddresses.filter(addr => addr.trim() !== '');
    
    if (!account || !portfolioAddress) {
      setError('Please connect wallet and ensure portfolio is selected');
      return;
    }

    if (validAddresses.length === 0) {
      setError('Please provide at least one valid token address');
      return;
    }

    // Validate all addresses
    const invalidAddresses = validAddresses.filter(addr => !validateAddress(addr));
    if (invalidAddresses.length > 0) {
      setError(`Invalid token addresses: ${invalidAddresses.join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification('Starting token initialization...');

    try {
      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create portfolio contract instance
      const portfolio = new ethers.Contract(
        portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );

      setNotification(`Initializing ${validAddresses.length} tokens...`);

      // Initialize tokens with the provided addresses
      const initTokenTx = await portfolio.initToken(validAddresses, {
        gasLimit: 1000000 * validAddresses.length // Adjust gas limit based on number of tokens
      });
      
      setNotification('Waiting for transaction to be mined...');
      await initTokenTx.wait();
      
      setSuccess(true);
      setTokenAddresses(['']); // Reset to single empty input
      setNotification(null);
      
      // Refresh portfolio data
      if (loadPortfolio) {
        await loadPortfolio();
      }

      console.log('Tokens initialized successfully:', validAddresses);
    } catch (err) {
      console.error('Error initializing tokens:', err);
      setError(err.message || 'Failed to initialize tokens. Please try again.');
      setNotification(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="init-token">
      <h4>Initialize Tokens</h4>
      
      <div className="token-inputs">
        {tokenAddresses.map((address, index) => (
          <div key={index} className="token-input-group">
            <input
              type="text"
              placeholder="Enter token address"
              value={address}
              onChange={(e) => updateTokenAddress(index, e.target.value)}
              disabled={loading}
              className={address.trim() !== '' && !validateAddress(address) ? 'invalid' : ''}
            />
            {tokenAddresses.length > 1 && (
              <button
                type="button"
                onClick={() => removeTokenInput(index)}
                className="remove-btn"
                disabled={loading}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button
          type="button"
          onClick={addTokenInput}
          className="add-btn"
          disabled={loading}
        >
          + Add Token
        </button>
        
        <button
          onClick={initTokens}
          disabled={loading || tokenAddresses.every(addr => addr.trim() === '')}
          className="init-btn"
        >
          {loading ? 'Initializing...' : `Init ${tokenAddresses.filter(addr => addr.trim() !== '').length} Token(s)`}
        </button>
      </div>

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
          <p>Tokens initialized successfully!</p>
          <button onClick={() => setSuccess(false)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default InitToken; 