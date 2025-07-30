import { useState, useEffect } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI, ERC20_ABI } from '../config/contracts';
import { getUserInvestedValue} from '../config/priceUtils';
import './PortfolioTokens.css';

const PortfolioTokens = ({ portfolio }) => {
  const { account } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInvestedValue, setUserInvestedValue] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (account && portfolio) {
      loadPortfolioTokens();
    }
  }, [account, portfolio]);

  const loadPortfolioTokens = async () => {
    if (!account || !portfolio) return;

    setLoading(true);
    setError(null);

    try {
      // Get user's invested value in USD and portfolio token balance
      const userData = await getUserInvestedValue(portfolio.portfolioAddress, account, 56);
      const userValueFormatted = parseFloat(userData.userInvestedValue);
      const userBalanceFormatted = parseFloat(userData.userBalance);
      
      setUserInvestedValue(userValueFormatted);
      setUserBalance(userBalanceFormatted);
    } catch (err) {
      console.error('Error loading portfolio tokens:', err);
      setError('Failed to load portfolio tokens');
    } finally {
      setLoading(false);
    }
  };

  const formatUSD = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (!account) {
    return (
      <div className="portfolio-tokens">
        <h3>Portfolio Tokens</h3>
        <p>Please connect your wallet to view portfolio tokens</p>
      </div>
    );
  }

  return (
    <div className="portfolio-tokens">
      <div className="portfolio-header">
        <h3>Your Portfolio Investment</h3>
        <div className="portfolio-values">
          <div className="user-invested-value">
            <span>Your Investment: {formatUSD(userInvestedValue)}</span>
          </div>
          <div className="user-balance">
            <span>Your Portfolio Tokens: {userBalance.toFixed(6)}</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <p>Loading portfolio tokens...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={loadPortfolioTokens}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="investment-summary">
          <p>Your portfolio investment details are shown above.</p>
        </div>
      )}

      <button 
        onClick={loadPortfolioTokens} 
        className="refresh-button"
        disabled={loading}
      >
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
};

export default PortfolioTokens; 