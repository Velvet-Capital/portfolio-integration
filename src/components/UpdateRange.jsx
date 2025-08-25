import React, { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { 
  PORTFOLIO_ABI, 
  ASSET_MANAGEMENT_CONFIG_ABI, 
  POSITION_MANAGER_ALGEBRA_ABI, 
  POSITION_WRAPPER_ABI,
  AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS,
} from '../config/contracts';
import { calculateSwapAmountUpdateRange } from '../config/helper';
import { ZERO_ADDRESS } from '../config/contracts';

const UpdateRange = ({ portfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState('');
  const [positionAddress, setPositionAddress] = useState('');
  const [tickLower, setTickLower] = useState('-120');
  const [tickUpper, setTickUpper] = useState('240');



  const handleUpdateRange = async () => {
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

    if (!tickLower || !tickUpper) {
      setError('Tick lower and upper values are required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotification('Starting update range process...');

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

      setNotification('Getting position data and calculating swap amounts...');

      let totalSupplyBefore = await positionWrapper.totalSupply();
      console.log("Total supply before:", totalSupplyBefore.toString());

      const newTickLower = parseInt(tickLower);
      const newTickUpper = parseInt(tickUpper);

      let updateRangeData = await calculateSwapAmountUpdateRange(
        positionManager.address,
        positionAddress,
        newTickLower,
        newTickUpper,
        AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS
      );

      setNotification('Updating position range...');

      const tx = await positionManager.updateRange({
        _positionWrapper: positionAddress,
        _swapDeployer: ZERO_ADDRESS,
        _tokenIn: updateRangeData.tokenIn,
        _tokenOut: updateRangeData.tokenOut,
        _deployer: ZERO_ADDRESS,
        _amountIn: updateRangeData.swapAmount.toString(),
        _underlyingAmountOut0: 0,
        _underlyingAmountOut1: 0,
        _tickLower: newTickLower,
        _tickUpper: newTickUpper,
        _fee: 100,
      }, {
        gasLimit: 2000000
      });

      setNotification('Waiting for transaction to be mined...');
      await tx.wait();

      setSuccess(true);
      setNotification('Position range successfully updated!');
      console.log("Update range completed successfully");

    } catch (err) {
      console.error('Error in update range:', err);
      setError(err.message || 'Failed to update range. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-range">
      <h4>Update Range</h4>
      <p>Update the tick range of a position</p>
      
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

      <div className="input-group">
        <label htmlFor="tickLower">Tick Lower:</label>
        <input
          type="number"
          id="tickLower"
          value={tickLower}
          onChange={(e) => setTickLower(e.target.value)}
          placeholder="Enter tick lower value"
          disabled={loading}
        />
      </div>

      <div className="input-group">
        <label htmlFor="tickUpper">Tick Upper:</label>
        <input
          type="number"
          id="tickUpper"
          value={tickUpper}
          onChange={(e) => setTickUpper(e.target.value)}
          placeholder="Enter tick upper value"
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
        onClick={handleUpdateRange}
        disabled={loading || !portfolio?.portfolioAddress || !positionAddress || !tickLower || !tickUpper}
      >
        {loading ? 'Processing...' : 'Update Range'}
      </button>
    </div>
  );
};

export default UpdateRange; 