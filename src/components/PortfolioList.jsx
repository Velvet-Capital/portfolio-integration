import { useState, useEffect } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { API_URL } from '../config/contracts';

const PortfolioList = () => {
  const { account } = useMetaMask();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolios = async () => {
    if (!account) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(account);
      const response = await fetch(`${API_URL}/portfolios/user/${account}`);
      if (!response.ok) {
        throw new Error('Failed to fetch portfolios');
      }
      const data = await response.json();
      setPortfolios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [account]);

  if (!account) {
    return (
      <div className="portfolio-list">
        <h3>Your Portfolios</h3>
        <p>Please connect your wallet to view your portfolios</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="portfolio-list">
        <h3>Your Portfolios</h3>
        <p>Loading portfolios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-list">
        <h3>Your Portfolios</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="portfolio-list">
        <h3>Your Portfolios</h3>
        <p>No portfolios found. Create your first portfolio to get started!</p>
      </div>
    );
  }

  return (
    <div className="portfolio-list">
      <h3>Your Portfolios</h3>
      <div className="portfolio-grid">
        {portfolios.map((portfolio) => (
          <div key={portfolio._id} className="portfolio-card">
            <h4>{portfolio.name} ({portfolio.symbol})</h4>
            <div className="portfolio-details">
              <p>
                <span>Address:</span>
                {portfolio.portfolioAddress.slice(0, 6)}...{portfolio.portfolioAddress.slice(-4)}
              </p>
              <p>
                <span>Created:</span>
                {new Date(portfolio.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="portfolio-fees">
              <p>
                <span>Management Fee:</span>
                {portfolio.managementFee}%
              </p>
              <p>
                <span>Performance Fee:</span>
                {portfolio.performanceFee}%
              </p>
              <p>
                <span>Entry Fee:</span>
                {portfolio.entryFee}%
              </p>
              <p>
                <span>Exit Fee:</span>
                {portfolio.exitFee}%
              </p>
            </div>
            <div className="portfolio-settings">
              <p>
                <span>Initial Amount:</span>
                {portfolio.initialAmount} ETH
              </p>
              <p>
                <span>Min Holding:</span>
                {portfolio.minHolding} ETH
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioList; 