import React, { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import WBNBApproval from './WBNBApproval';
import CreatePosition from './CreatePosition';
import DepositWBNB from './DepositWBNB';
import RebalancePortfolio from './RebalancePortfolio';
import WithdrawWBNB from './WithdrawWBNB';
import InitToken from './InitToken';
import Borrow from './Borrow';
import PortfolioTokens from './PortfolioTokens';
import UpdateWeight from './UpdateWeight';
import './CreatePortfolio.css';

const LM5Portfolio = "0x77b3bFaC49ab8a15200038DBFb9dd9A287371E6C";

const CreatePortfolio = () => {
  const { account, connect } = useMetaMask();
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Hardcoded portfolio data
  const portfolio = {
    _id: "lm5-portfolio",
    name: "LM5 Portfolio",
    symbol: "LM5",
    portfolioAddress: LM5Portfolio,
    assetManagementConfig: "0x0000000000000000000000000000000000000000", // You may need to get this from the contract
    positionList: [],
    positionIndex: 0,
    rebalancing: "0xcc55661e8df21c02782e0ce4fe2944a8b1982509",
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(portfolio.portfolioAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div className="create-portfolio">
      <h2>LM5 Portfolio Management</h2>
      {!account ? (
        <div className="connect-prompt">
          <p>Please connect your wallet to continue</p>
        </div>
      ) : (
        <div className="portfolio-management">
          <div className="portfolio-info">
            <h3>{portfolio.name}</h3>
            <div className="address-container">
              <p>Address: {portfolio.portfolioAddress}</p>
              <button onClick={copyToClipboard} className="copy-button">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p>Symbol: {portfolio.symbol}</p>
          </div>
          
          <div className="portfolio-actions">
            <CreatePosition portfolioAddress={portfolio.portfolioAddress} />
            {/* <InitToken portfolioAddress={portfolio.portfolioAddress} />
            <WBNBApproval portfolio={portfolio} /> */}
            <PortfolioTokens portfolio={portfolio} />
            <DepositWBNB portfolio={portfolio} />
            <RebalancePortfolio portfolio={portfolio} />
            <WithdrawWBNB portfolio={portfolio} />
            <UpdateWeight portfolio={portfolio} />
            <Borrow portfolio={portfolio} />
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