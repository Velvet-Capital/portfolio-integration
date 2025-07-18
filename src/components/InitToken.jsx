import React, { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI } from '../config/contracts';

const InitToken = ({ portfolioAddress, loadPortfolio }) => {
  const { account } = useMetaMask();
  const [tokenAddress, setTokenAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const initToken = async () => {
    if (!account || !portfolioAddress || !tokenAddress) {
      setError('Please provide a token address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

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

      // Initialize token with the provided address
      const initTokenTx = await portfolio.initToken([tokenAddress], {
        gasLimit: 1000000
      });
      
      await initTokenTx.wait();
      
      setSuccess(true);
      setTokenAddress('');
      
      // Refresh portfolio data
      if (loadPortfolio) {
        await loadPortfolio();
      }

      console.log('Token initialized successfully:', tokenAddress);
    } catch (err) {
      console.error('Error initializing token:', err);
      setError(err.message || 'Failed to initialize token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="init-token">
      <h4>Initialize Token</h4>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter token address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={initToken}
          disabled={loading || !tokenAddress.trim()}
        >
          {loading ? 'Initializing...' : 'Init Token'}
        </button>
      </div>
      
      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {success && (
        <div className="success">
          <p>Token initialized successfully!</p>
          <button onClick={() => setSuccess(false)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default InitToken; 