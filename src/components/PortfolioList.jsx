import { useMetaMask } from '../contexts/MetaMaskContext';

const PortfolioList = () => {
  const { account } = useMetaMask();
  const LM5Portfolio = "0x31d081b8f9729643e5820baa8fa4982393c9eb25";
  
  // Hardcoded portfolio data
  const portfolio = {
    _id: "lm5-portfolio",
    name: "LM5 Portfolio",
    symbol: "LM5",
    portfolioAddress: LM5Portfolio,
    createdAt: new Date().toISOString(),
    managementFee: 2,
    performanceFee: 20,
    entryFee: 1,
    exitFee: 1
  };

  if (!account) {
    return (
      <div className="portfolio-list">
        <h3>Your Portfolios</h3>
        <p>Please connect your wallet to view your portfolios</p>
      </div>
    );
  }

  return (
    <div className="portfolio-list">
      <h3>Your Portfolio</h3>
      <div className="portfolio-grid">
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
        </div>
      </div>
    </div>
  );
};

export default PortfolioList; 