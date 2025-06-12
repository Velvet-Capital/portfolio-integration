import { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI } from '../config/contracts';
import { PERMIT2_ADDRESS, MaxAllowanceTransferAmount } from "@uniswap/permit2-sdk";
import './WBNBApproval.css';

const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // BSC Mainnet

// ERC20 ABI for balance checking
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

const WBNBApproval = ({ portfolio }) => {
  console.log("portfolio", portfolio);
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showBalanceWarning, setShowBalanceWarning] = useState(false);
  const [wbnbBalance, setWbnbBalance] = useState(null);
  const [wbnbAmount, setWbnbAmount] = useState('');
  const [notification, setNotification] = useState(null);

  const checkWBNBBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const WBNB = new ethers.Contract(WBNB_ADDRESS, ERC20_ABI, signer);
      const balance = await WBNB.balanceOf(account);
      const formattedBalance = ethers.utils.formatEther(balance);
      setWbnbBalance(formattedBalance);
      
      if (balance.isZero()) {
        setShowBalanceWarning(true);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error checking WBNB balance:', err);
      setError('Failed to check WBNB balance');
      return false;
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setWbnbAmount(value);
    }
  };

  const approveWBNB = async () => {
    if (!account) {
      await connect();
      return;
    }

    if (!wbnbAmount || parseFloat(wbnbAmount) <= 0) {
      setError('Please enter a valid WBNB amount');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setShowBalanceWarning(false);
    setNotification('Starting WBNB approval process...');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Check WBNB balance first
      setNotification('Checking WBNB balance...');
      const hasBalance = await checkWBNBBalance();
      if (!hasBalance) {
        setLoading(false);
        return;
      }

      // Get portfolio contract
      const portfolioContract = new ethers.Contract(
        portfolio.portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );

 
      // Get tokens from portfolio
      const tokens = await portfolioContract.getTokens();
      setNotification(`Found ${tokens.length} tokens to approve`);

      // Check and fund WBNB if needed
      const WBNB = new ethers.Contract(WBNB_ADDRESS, ERC20_ABI, signer);
      const wbnbBalance = await WBNB.balanceOf(account);
      const requiredAmount = ethers.utils.parseEther(wbnbAmount);
      
      if (wbnbBalance.lt(requiredAmount)) {
        setNotification('Funding account with WBNB...');
        // Mint WBNB for testing
        throw new Error('Not enough WBNB in account');
      }

      // Approve tokens to Permit2
      setNotification('Starting token approvals to Permit2...');
      for (let i = 0; i < tokens.length; i++) {
        setNotification(`Approving token ${i + 1}/${tokens.length}...`);
        try {
          const tokenContract = new ethers.Contract(tokens[i], ERC20_ABI, signer);
          setNotification(`Resetting approval for token ${i + 1}...`);
          const resetTx = await tokenContract.approve(PERMIT2_ADDRESS, 0, { gasLimit: 1000000 });
          await resetTx.wait();
          setNotification(`Setting max approval for token ${i + 1}...`);
          const approveTx = await tokenContract.approve(
            PERMIT2_ADDRESS,
            MaxAllowanceTransferAmount,
            { gasLimit: 1000000 }
          );
          await approveTx.wait();
          setNotification(`Successfully approved token ${i + 1}`);
        } catch (error) {
          console.error(`Error approving token ${tokens[i]}:`, error);
          throw error;
        }
      }
      setNotification('All token approvals completed successfully!');
      setSuccess(true);
    } catch (err) {
      console.error('Error approving WBNB:', err);
      setError(err.message || 'Failed to approve WBNB. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wbnb-approval">
      <div className="input-group">
        <input
          type="text"
          value={wbnbAmount}
          onChange={handleAmountChange}
          placeholder="Enter WBNB amount"
          className="wbnb-input"
        />
        <span className="input-suffix">WBNB</span>
      </div>
      
      <button
        onClick={approveWBNB}
        disabled={loading || !wbnbAmount}
        className="approve-button"
      >
        {loading ? 'Approving WBNB...' : 'Approve WBNB'}
      </button>
      
      {notification && (
        <div className="notification">
          <p>{notification}</p>
        </div>
      )}
      
      {showBalanceWarning && (
        <div className="balance-warning">
          <p>⚠️ Your WBNB balance is {wbnbBalance} WBNB</p>
          <p>Please ensure you have sufficient WBNB to proceed with the approval.</p>
          <button onClick={() => setShowBalanceWarning(false)}>Dismiss</button>
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
          <p>WBNB approval completed successfully!</p>
        </div>
      )}
    </div>
  );
};

export default WBNBApproval; 