import { useState, useEffect } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI, VENUS_ASSET_HANDLER_ABI } from '../config/contracts';
import { chainIdToAddresses } from '../config/networkVariables';
import { venusAssetHandlerAddress } from '../config/contracts';
import './CollateralStatus.css';

const addresses = chainIdToAddresses[56];

const CollateralStatus = ({ portfolio }) => {
  const { account } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collateralStatus, setCollateralStatus] = useState({});
  const [vaultAddress, setVaultAddress] = useState(null);

  // Available tokens to check for collateral status
  const availableTokens = [
    { value: addresses.vETH_Address, label: 'vETH_Address', address: addresses.vETH_Address },
    { value: addresses.vBNB_Address, label: 'vBNB_Address', address: addresses.vBNB_Address },
    { value: addresses.vUSDT_Address, label: 'vUSDT_Address', address: addresses.vUSDT_Address },
    { value: addresses.vDAI_Address, label: 'vDAI_Address', address: addresses.vDAI_Address },
    { value: addresses.vBTC_Address, label: 'vBTC_Address', address: addresses.vBTC_Address },
    { value: addresses.vDOGE_Address, label: 'vDOGE_Address', address: addresses.vDOGE_Address },
    { value: addresses.vLINK_Address, label: 'vLINK_Address', address: addresses.vLINK_Address },
    { value: addresses.vUSDC_Address, label: 'vUSDC_Address', address: addresses.vUSDC_Address },
  ];

  const checkCollateralStatus = async () => {
    if (!portfolio || !portfolio.portfolioAddress) {
      setError('Portfolio not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get portfolio contract
      const portfolioContract = new ethers.Contract(
        portfolio.portfolioAddress,
        PORTFOLIO_ABI,
        signer
      );

      // Get vault address
      const vault = await portfolioContract.vault();
      setVaultAddress(vault);

      // Get Venus Asset Handler contract
      const venusAssetHandler = new ethers.Contract(
        venusAssetHandlerAddress,
        VENUS_ASSET_HANDLER_ABI,
        signer
      );

      console.log("Checking collateral status for vault:", vault);
      console.log("Comptroller address:", addresses.corePool_controller);

      // Check collateral status for each token
      const status = {};
      for (const token of availableTokens) {
        try {
          const isCollateral = await venusAssetHandler.isCollateralEnabled(
            token.value,
            vault,
            addresses.corePool_controller
          );
          status[token.value] = {
            label: token.label,
            address: token.value,
            isEnabled: isCollateral
          };
          console.log(`${token.label}: ${isCollateral ? 'Enabled' : 'Disabled'}`);
        } catch (err) {
          console.error(`Error checking ${token.label}:`, err);
          status[token.value] = {
            label: token.label,
            address: token.value,
            isEnabled: false,
            error: err.message
          };
        }
      }

      setCollateralStatus(status);
    } catch (err) {
      console.error('Error checking collateral status:', err);
      setError(err.message || 'Failed to check collateral status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (portfolio && portfolio.portfolioAddress) {
      checkCollateralStatus();
    }
  }, [portfolio]);

  const getStatusIcon = (isEnabled, hasError) => {
    if (hasError) {
      return <span className="status-icon error">⚠️</span>;
    }
    return isEnabled ? 
      <span className="status-icon enabled">✅</span> : 
      <span className="status-icon disabled">❌</span>;
  };

  const getStatusText = (isEnabled, hasError) => {
    if (hasError) {
      return 'Error';
    }
    return isEnabled ? 'Enabled' : 'Disabled';
  };

  const getStatusClass = (isEnabled, hasError) => {
    if (hasError) {
      return 'status-error';
    }
    return isEnabled ? 'status-enabled' : 'status-disabled';
  };

  return (
    <div className="collateral-status w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Collateral Status</h3>
        <button
          onClick={checkCollateralStatus}
          disabled={loading}
          className="refresh-btn px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {vaultAddress && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <strong>Vault Address:</strong> {vaultAddress}
        </div>
      )}

      {error && (
        <div className="error w-full p-2 bg-red-100 text-red-700 rounded text-center mb-4">
          {error}
        </div>
      )}

      <div className="token-list">
        {availableTokens.map((token) => {
          const status = collateralStatus[token.value];
          return (
            <div key={token.value} className="token-item flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0">
              <div className="token-info">
                <div className="token-label font-medium text-gray-900">
                  {token.label}
                </div>
                <div className="token-address text-xs text-gray-500">
                  {token.value}
                </div>
              </div>
              <div className={`token-status ${getStatusClass(status?.isEnabled, status?.error)}`}>
                {getStatusIcon(status?.isEnabled, status?.error)}
                <span className="status-text ml-2">
                  {status ? getStatusText(status.isEnabled, status.error) : 'Loading...'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="loading-indicator text-center py-4 text-gray-500">
          Checking collateral status...
        </div>
      )}

      {!loading && Object.keys(collateralStatus).length > 0 && (
        <div className="summary mt-4 p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">
            <strong>Summary:</strong>
            <div className="mt-1">
              Enabled: {Object.values(collateralStatus).filter(s => s.isEnabled).length} tokens
            </div>
            <div>
              Disabled: {Object.values(collateralStatus).filter(s => !s.isEnabled && !s.error).length} tokens
            </div>
            {Object.values(collateralStatus).some(s => s.error) && (
              <div className="text-red-600">
                Errors: {Object.values(collateralStatus).filter(s => s.error).length} tokens
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollateralStatus; 