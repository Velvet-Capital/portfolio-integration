import { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI } from '../config/contracts';
import { PERMIT2_ADDRESS, AllowanceTransfer } from "@uniswap/permit2-sdk";
import './DepositTokens.css';

// ERC20 ABI for balance checking
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

// Permit2 ABI
const PERMIT2_ABI = [
  "function allowance(address owner, address token, address spender) view returns (uint160 amount, uint48 expiration, uint48 nonce)"
];

const DepositTokens = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);

  const toDeadline = (expiration) => {
    return Math.floor((Date.now() + expiration) / 1000);
  };

  const handleDeposit = async () => {
    if (!account) {
      await connect();
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification('Starting multi-token deposit process...');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const chainId = (await provider.getNetwork()).chainId;

      // Get portfolio contract
      const portfolioContract = new ethers.Contract(
        portfolio.portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );

      // Get Permit2 contract
      const permit2 = new ethers.Contract(PERMIT2_ADDRESS, PERMIT2_ABI, signer);

      // Get tokens to deposit
      const depositTokens = await portfolioContract.getTokens();
      setNotification(`Found ${depositTokens.length} tokens to deposit`);

      let tokenDetails = [];
      let amounts = [];

      // Get token details and balances
      for (let i = 0; i < depositTokens.length; i++) {
        setNotification(`Processing token ${i + 1}/${depositTokens.length}...`);
        
        // Get nonce from Permit2
        const { nonce } = await permit2.allowance(
          account,
          depositTokens[i],
          portfolio.portfolioAddress
        );

        // Get token balance
        const tokenContract = new ethers.Contract(depositTokens[i], ERC20_ABI, signer);
        const balance = await tokenContract.balanceOf(account);
        
        setNotification(`Balance for token ${i + 1}: ${ethers.utils.formatEther(balance)} BNB`);

        let detail = {
          token: depositTokens[i],
          amount: balance,
          expiration: toDeadline(1000 * 60 * 60 * 30), // 30 hours
          nonce,
        };
        amounts.push(balance);
        tokenDetails.push(detail);
      }

      // Prepare permit data
      const permit = {
        details: tokenDetails,
        spender: portfolio.portfolioAddress,
        sigDeadline: toDeadline(1000 * 60 * 60 * 30),
      };

      setNotification('Preparing permit data...');
      const { domain, types, values } = AllowanceTransfer.getPermitData(
        permit,
        PERMIT2_ADDRESS,
        chainId
      );

      setNotification('Signing permit data...');
      const signature = await signer._signTypedData(domain, types, values);

      // Execute deposit
      setNotification('Executing deposit transaction...');
      const depositTx = await portfolioContract.multiTokenDeposit(
        amounts,
        "0",
        permit,
        signature
      );

      setNotification('Waiting for deposit transaction to be mined...');
      await depositTx.wait();
      
      setNotification('Deposit completed successfully!');
      setSuccess(true);
    } catch (err) {
      console.error('Error during deposit:', err);
      setError(err.message || 'Failed to deposit tokens. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-tokens">
      <button
        onClick={handleDeposit}
        disabled={loading}
        className="deposit-button"
      >
        {loading ? 'Processing Deposit...' : 'Deposit Tokens'}
      </button>
      
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
          <p>Tokens deposited successfully!</p>
        </div>
      )}
    </div>
  );
};

export default DepositTokens; 