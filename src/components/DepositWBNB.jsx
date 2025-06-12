import { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI } from '../config/contracts';
import { PERMIT2_ADDRESS, AllowanceTransfer } from "@uniswap/permit2-sdk";
import './DepositWBNB.css';

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

const DepositWBNB = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [amount, setAmount] = useState('');

  const toDeadline = (expiration) => {
    return Math.floor((Date.now() + expiration) / 1000);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleDeposit = async () => {
    if (!account) {
      await connect();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount to deposit');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification('Starting WBNB deposit process...');

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
        
        // Use the provided amount instead of full balance
        const depositAmount = ethers.utils.parseEther(amount);
        
        if (balance.lt(depositAmount)) {
          throw new Error(`Insufficient balance for token ${i + 1}. Required: ${amount} WBNB, Available: ${ethers.utils.formatEther(balance)} WBNB`);
        }

        setNotification(`Processing deposit of ${amount} WBNB for token ${i + 1}`);

        let detail = {
          token: depositTokens[i],
          amount: depositAmount,
          expiration: toDeadline(1000 * 60 * 60 * 30), // 30 hours
          nonce,
        };
        amounts.push(depositAmount);
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
    <div className="deposit-wbnb">
      <div className="input-group">
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter WBNB amount"
          className="wbnb-input"
        />
        <span className="input-suffix">WBNB</span>
      </div>

      <button
        onClick={handleDeposit}
        disabled={loading || !amount}
        className="deposit-button"
      >
        {loading ? 'Processing Deposit...' : 'Deposit WBNB'}
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
          <p>Successfully deposited {amount} WBNB!</p>
        </div>
      )}
    </div>
  );
};

export default DepositWBNB; 