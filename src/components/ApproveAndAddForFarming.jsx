import React, { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { 
  PORTFOLIO_ABI, 
  ASSET_MANAGEMENT_CONFIG_ABI, 
  POSITION_MANAGER_ALGEBRA_ABI, 
  POSITION_WRAPPER_ABI,
  FACTORY_ABI,
  POOL_TO_KEY_ABI
} from '../config/contracts';
import { FACTORY_ADDRESS, ZERO_ADDRESS } from '../config/contracts';

const ApproveAndAddForFarming = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState('');
  const [positionAddress, setPositionAddress] = useState('');

  const handleApproveAndAddForFarming = async () => {
    if (!account) {
      await connect();
      return;
    }

    if (!portfolio?.portfolioAddress) {
      setError('Portfolio address is required');
      return;
    }

    if (!positionAddress) {
      setError('Position address is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification('Starting approve and add for farming...');

    try {
      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const portfolioContract = new ethers.Contract(
        portfolio.portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );

      const assetManagementConfigAddress = await portfolioContract.assetManagementConfig();

      // Attach to AssetManagementConfig
      const assetManagementConfig = new ethers.Contract(
        assetManagementConfigAddress,
        ASSET_MANAGEMENT_CONFIG_ABI,
        signer
      );

      // Get position manager address
      const positionManagerAddress = await assetManagementConfig.lastDeployedPositionManager();
      console.log("Raw position manager address:", positionManagerAddress);

      if (!positionManagerAddress || positionManagerAddress === ZERO_ADDRESS) {
        throw new Error("Position manager address is zero or undefined");
      }

      // Attach to PositionManager
      const positionManager = new ethers.Contract(
        positionManagerAddress,
        POSITION_MANAGER_ALGEBRA_ABI,
        signer
      );

      // Use the user-provided position address
      const positionWrapper = new ethers.Contract(
        positionAddress,
        POSITION_WRAPPER_ABI,
        signer
      );

      const tokenId = await positionWrapper.tokenId();
      const token0 = await positionWrapper.token0();
      const token1 = await positionWrapper.token1();

      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        signer
      );

      const poolAddress = await factoryContract.poolByPair(token0, token1);
      console.log("poolAddress", poolAddress);

      const poolToKeyContract = new ethers.Contract(
        "0x80ad2f2Ed4F00b152D7cA5E74920c944BFEF0701",
        POOL_TO_KEY_ABI,
        signer
      );

      const incentiveKey = await poolToKeyContract.poolToKey(poolAddress);

      setNotification('Approving and adding position for farming...');

      const tx = await positionManager.approveAndAddForFarming(
        tokenId,
        poolAddress,
        incentiveKey.rewardToken,
        incentiveKey.bonusRewardToken,
        incentiveKey.nonce,
        {
          gasLimit: 1000000
        }
      );

      setNotification('Waiting for transaction to be mined...');
      await tx.wait();

      setSuccess(true);
      setNotification('Position successfully approved and added for farming!');
      console.log("Approve and add for farming completed successfully");

    } catch (err) {
      console.error('Error in approve and add for farming:', err);
      setError(err.message || 'Failed to approve and add for farming. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="approve-and-add-farming">
      <h4>Approve and Add for Farming</h4>
      <p>Approve and add position to farming incentives</p>
      
      <div className="input-group">
        <label htmlFor="positionAddress">Position Address:</label>
        <input
          type="text"
          id="positionAddress"
          value={positionAddress}
          onChange={(e) => setPositionAddress(e.target.value)}
          placeholder="Enter position address"
          disabled={loading}
        />
      </div>
      
      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {success && (
        <div className="success">
          <p>{notification}</p>
          <button onClick={() => setSuccess(false)}>Dismiss</button>
        </div>
      )}

      {loading && (
        <div className="loading">
          <p>{notification}</p>
        </div>
      )}

      <button
        onClick={handleApproveAndAddForFarming}
        disabled={loading || !portfolio?.portfolioAddress || !positionAddress}
      >
        {loading ? 'Processing...' : 'Approve and Add for Farming'}
      </button>
    </div>
  );
};

export default ApproveAndAddForFarming; 