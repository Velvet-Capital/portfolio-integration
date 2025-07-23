import React, { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import WBNBApproval from './WBNBApproval';
import CreatePosition from './CreatePosition';
import DepositWBNB from './DepositWBNB';
import RebalancePortfolio from './RebalancePortfolio';
import WithdrawWBNB from './WithdrawWBNB';
import InitToken from './InitToken';
import './CreatePortfolio.css';

const LM5Portfolio = "0x31d081b8f9729643e5820baa8fa4982393c9eb25";

const CreatePortfolio = () => {
  const { account, connect } = useMetaMask();
  const [error, setError] = useState(null);
  
  // Hardcoded portfolio data
  const portfolio = {
    _id: "lm5-portfolio",
    name: "LM5 Portfolio",
    symbol: "LM5",
    portfolioAddress: LM5Portfolio,
    assetManagementConfig: "0x0000000000000000000000000000000000000000", // You may need to get this from the contract
    positionList: [],
    positionIndex: 0
  };

  return (
    <div className="create-portfolio">
      <h2>LM5 Portfolio Management</h2>
      {!account ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div className="portfolio-management">
          <div className="portfolio-info">
            <h3>{portfolio.name}</h3>
            <p>Address: {portfolio.portfolioAddress}</p>
            <p>Symbol: {portfolio.symbol}</p>
          </div>
          
          <div className="portfolio-actions">
            {/* <CreatePosition portfolioAddress={portfolio.portfolioAddress} /> */}
            <InitToken portfolioAddress={portfolio.portfolioAddress} />
            <WBNBApproval portfolio={portfolio} />
            <DepositWBNB portfolio={portfolio} />
            {/* <RebalancePortfolio portfolio={portfolio} /> */}
            <WithdrawWBNB portfolio={portfolio} />
          </div>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default CreatePortfolio; 