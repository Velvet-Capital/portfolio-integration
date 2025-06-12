import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { 
  THENA_PROTOCOL_HASH,
  ZERO_ADDRESS,
  API_URL,
  PORTFOLIO_ABI,
  ASSET_MANAGEMENT_CONFIG_ABI,
  POSITION_MANAGER_ALGEBRA_ABI,
  TOKEN_BALANCE_LIBRARY_ADDRESS,
  SWAP_VERIFICATION_LIBRARY_ALGEBRA_ADDRESS
} from '../config/contracts';

const ThenaInitialization = ({ portfolioAddress, loadPortfolio }) => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [positionManagerAddress, setPositionManagerAddress] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    console.log('PortfolioInitialization mounted with address:', portfolioAddress);
  }, [portfolioAddress]);

  const handleInitialize = async () => {
    if (!account) {
      await connect();
      return;
    }

    if (!portfolioAddress) {
      setError('Portfolio address is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setPositionManagerAddress(null);
    setNotification('Starting Thena initialization...');

    try {
      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get portfolio info from the database
      const response = await fetch(`${API_URL}/portfolios/${portfolioAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio info');
      }
      const portfolioInfo = await response.json();
      console.log("Portfolio info:", portfolioInfo);



      console.log("Portfolio attached at:", portfolioAddress);

      // Attach to AssetManagementConfig
      const assetManagementConfig = new ethers.Contract(
        portfolioInfo.assetManagementConfig,
        ASSET_MANAGEMENT_CONFIG_ABI,
        signer
      );
      console.log("AssetManagementConfig address:", portfolioInfo.assetManagementConfig);

      // Enable UniswapV3 manager for Thena protocol
      console.log("Enabling UniswapV3 manager for Thena protocol...");
      const enableTx = await assetManagementConfig.enableUniSwapV3Manager(THENA_PROTOCOL_HASH);
      console.log("Waiting for enable transaction to be mined...");
      await enableTx.wait();
      console.log("UniswapV3 manager enabled successfully");

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
      console.log("PositionManager address:", positionManagerAddress);

      // Verify the position manager is properly initialized
      try {
        const deployedPositionWrappersLength = await getDeployedPositionWrappersLength(positionManager);
        console.log("Current number of deployed position wrappers:", deployedPositionWrappersLength.toString());
      } catch (error) {
        console.error("Error verifying position manager:", error);
        throw error;
      }

      const updateFields = {
        initializedThena: true
      };
      const updateResponse = await fetch(`${API_URL}/portfolios/${portfolioAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updateFields })
      });
      if (!updateResponse.ok) {
        throw new Error('Failed to update portfolio info');
      }

      
      setPositionManagerAddress(positionManagerAddress);
      setSuccess(true);
      setNotification('Thena initialization completed successfully!');
      console.log("Portfolio initialization completed successfully");
      
      // Add a small delay before reloading to ensure the blockchain state is updated
      if (loadPortfolio) {
        console.log("Calling loadPortfolio after initialization");
        await loadPortfolio();
      }

    } catch (err) {
      console.error('Error initializing portfolio:', err);
      setError(err.message || 'Failed to initialize portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  async function getDeployedPositionWrappersLength(positionManager) {
    let length = 0;
    while (true) {
      try {
        await positionManager.deployedPositionWrappers(length);
        length++;
      } catch (e) {
        break;
      }
    }
    return length;
  }

  return (
    <div className="portfolio-initialization" style={{ border: '2px solid red' }}>
      <h3>Portfolio Initialization</h3>
      {!account ? (
        <button onClick={connect} className="connect-button">
          Connect Wallet
        </button>
      ) : (
        <button 
          onClick={handleInitialize} 
          disabled={loading}
          className="initialize-button"
          style={{ backgroundColor: 'red' }}
        >
          {loading ? 'Initializing...' : 'Initialize Portfolio'}
        </button>
      )}
      
      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {success && positionManagerAddress && (
        <div className="success">
          <p>Portfolio initialized successfully!</p>
          <p>Position Manager Address: {positionManagerAddress}</p>
        </div>
      )}
    </div>
  );
};

export default ThenaInitialization; 