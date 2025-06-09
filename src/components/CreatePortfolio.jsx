import { useState, useEffect } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { 
  PORTFOLIO_FACTORY_ADDRESS,
  TREASURY_ADDRESS,
  THENA_PROTOCOL_HASH,
  DEFAULT_FEES,
  DEFAULT_PORTFOLIO,
  PORTFOLIO_FACTORY_ABI,
  API_URL
} from '../config/contracts';

const CreatePortfolio = () => {
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [portfolioAddress, setPortfolioAddress] = useState(null);
  const [portfolios, setPortfolios] = useState([]);

  const fetchUserPortfolios = async () => {
    if (!account) return;

    try {
      console.log('Fetching portfolios for account:', account);
      const response = await fetch(`${API_URL}/portfolios/user/${account}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched portfolios:', data);
      setPortfolios(data);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      setError('Failed to fetch portfolios. Please check if the server is running.');
    }
  };

  useEffect(() => {
    fetchUserPortfolios();
  }, [account]);

  const createPortfolio = async () => {
    if (!account) {
      await connect();
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setPortfolioAddress(null);

    try {
      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract instance
      const factory = new ethers.Contract(
        PORTFOLIO_FACTORY_ADDRESS,
        PORTFOLIO_FACTORY_ABI,
        signer
      );

      // Prepare portfolio parameters with validation
      const portfolioParams = {
        _name: "PORTFOLIOLY",
        _symbol: "IDX",
        _managementFee: (DEFAULT_FEES.managementFee || 2) * 100, // Convert to basis points
        _performanceFee: (DEFAULT_FEES.performanceFee || 20) * 100,
        _entryFee: (DEFAULT_FEES.entryFee || 1) * 100,
        _exitFee: (DEFAULT_FEES.exitFee || 1) * 100,
        _initialPortfolioAmount: ethers.utils.parseEther((DEFAULT_PORTFOLIO.initialAmount || 0.1).toString()),
        _minPortfolioTokenHoldingAmount: ethers.utils.parseEther((DEFAULT_PORTFOLIO.minHolding || 0.01).toString()),
        _assetManagerTreasury: TREASURY_ADDRESS,
        _whitelistedTokens: [],
        _public: true,
        _transferable: true,
        _transferableToPublic: true,
        _whitelistTokens: false,
        _witelistedProtocolIds: [THENA_PROTOCOL_HASH]
      };

      // Log portfolio parameters for debugging
      console.log('Portfolio Parameters:', {
        ...portfolioParams,
        _initialPortfolioAmount: ethers.utils.formatEther(portfolioParams._initialPortfolioAmount),
        _minPortfolioTokenHoldingAmount: ethers.utils.formatEther(portfolioParams._minPortfolioTokenHoldingAmount)
      });

      // Validate parameters
      if (!portfolioParams._assetManagerTreasury) {
        throw new Error('Treasury address is required');
      }
      if (portfolioParams._managementFee < 0 || portfolioParams._managementFee > 10000) {
        throw new Error('Management fee must be between 0 and 100%');
      }
      if (portfolioParams._performanceFee < 0 || portfolioParams._performanceFee > 10000) {
        throw new Error('Performance fee must be between 0 and 100%');
      }
      if (portfolioParams._entryFee < 0 || portfolioParams._entryFee > 10000) {
        throw new Error('Entry fee must be between 0 and 100%');
      }
      if (portfolioParams._exitFee < 0 || portfolioParams._exitFee > 10000) {
        throw new Error('Exit fee must be between 0 and 100%');
      }
      if (portfolioParams._initialPortfolioAmount.lte(0)) {
        throw new Error('Initial amount must be greater than 0');
      }
      if (portfolioParams._minPortfolioTokenHoldingAmount.lte(0)) {
        throw new Error('Minimum holding must be greater than 0');
      }

      // Estimate gas limit
      const gasEstimate = await factory.estimateGas.createPortfolioNonCustodial(portfolioParams);

      // Add 20% buffer to gas estimate for safety
      const gasLimit = gasEstimate.mul(120).div(100);

      console.log('Gas estimate:', {
        estimate: gasEstimate.toString(),
        withBuffer: gasLimit.toString()
      });

      // Create portfolio with gas configuration
      const tx = await factory.createPortfolioNonCustodial(portfolioParams);

      console.log('Transaction sent:', {
        hash: tx.hash,
        gasLimit: gasLimit.toString()
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      // Get the portfolio info from the PortfolioInfo event
      const event = receipt.events.find(e => e.event === 'PortfolioInfo');
      if (!event) {
        throw new Error('PortfolioInfo event not found in transaction receipt');
      }

      // Extract all addresses from the PortfoliolInfo struct (first argument)
      const portfolioInfo = {
        portfolio: event.args.portfolioData.portfolio,
        tokenExclusionManager: event.args.portfolioData.tokenExclusionManager,
        rebalancing: event.args.portfolioData.rebalancing,
        owner: event.args.portfolioData.owner,
        borrowManager: event.args.portfolioData.borrowManager,
        assetManagementConfig: event.args.portfolioData.assetManagementConfig,
        feeModule: event.args.portfolioData.feeModule,
        vaultAddress: event.args.portfolioData.vaultAddress,
        gnosisModule: event.args.portfolioData.gnosisModule
      };

      console.log('Portfolio Info:', portfolioInfo);

      // Get other event parameters
      const portfolioId = event.args.portfolioId;
      const name = event.args._name;
      const symbol = event.args._symbol;
      const owner = event.args._owner;
      const accessController = event.args._accessController;
      const isPublicPortfolio = event.args.isPublicPortfolio;

      // Save portfolio to database with all addresses and event data
      await savePortfolioToDatabase(portfolioInfo, {
        ...portfolioParams,
        portfolioId,
        name,
        symbol,
        owner,
        accessController,
        isPublicPortfolio
      });

      setSuccess(true);
      setPortfolioAddress(portfolioInfo.portfolio);
      // Refresh portfolios list
      await fetchUserPortfolios();
      
      console.log('Portfolio created successfully:', {
        portfolioInfo,
        portfolioId,
        name,
        symbol,
        owner,
        accessController,
        isPublicPortfolio,
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice.toString()
      });
    } catch (err) {
      console.error('Error creating portfolio:', err);
      setError(err.message || 'Failed to create portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const savePortfolioToDatabase = async (portfolioInfo, params) => {
    try {
      const response = await fetch(`${API_URL}/portfolios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: account,
          portfolioAddress: portfolioInfo.portfolio,
          portfolioId: Number(params.portfolioId),
          name: params.name,
          symbol: params.symbol,
          owner: params.owner,
          accessController: params.accessController,
          isPublicPortfolio: params.isPublicPortfolio,
          managementFee: params._managementFee / 100, // Convert back from basis points
          performanceFee: params._performanceFee / 100,
          entryFee: params._entryFee / 100,
          exitFee: params._exitFee / 100,
          initialAmount: ethers.utils.formatEther(params._initialPortfolioAmount),
          minHolding: ethers.utils.formatEther(params._minPortfolioTokenHoldingAmount),
          isPublic: params._public,
          isTransferable: params._transferable,
          isTransferableToPublic: params._transferableToPublic,
          whitelistTokens: params._whitelistTokens,
          whitelistedProtocolIds: params._witelistedProtocolIds,
          // Add all the module addresses
          tokenExclusionManager: portfolioInfo.tokenExclusionManager,
          rebalancing: portfolioInfo.rebalancing,
          owner: portfolioInfo.owner,
          borrowManager: portfolioInfo.borrowManager,
          assetManagementConfig: portfolioInfo.assetManagementConfig,
          feeModule: portfolioInfo.feeModule,
          vaultAddress: portfolioInfo.vaultAddress,
          gnosisModule: portfolioInfo.gnosisModule
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save portfolio to database');
      }
    } catch (err) {
      console.error('Error saving portfolio to database:', err);
      throw new Error('Failed to save portfolio to database. Please try again.');
    }
  };

  return (
    <div className="create-portfolio">
      <h2>Create New Portfolio</h2>
      {!account ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <button 
          onClick={createPortfolio} 
          disabled={loading}
        >
          {loading ? 'Creating Portfolio...' : 'Create Portfolio'}
        </button>
      )}
      
      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {success && portfolioAddress && (
        <div className="success">
          <p>Portfolio created successfully!</p>
          <p>Address: {portfolioAddress}</p>
        </div>
      )}

      {portfolios.length > 0 && (
        <div className="portfolios-list">
          <h3>Your Portfolios</h3>
          <div className="portfolios-grid">
            {portfolios.map((portfolio) => (
              <div key={portfolio._id} className="portfolio-card">
                <h4>{portfolio.name} ({portfolio.symbol})</h4>
                <p>Address: {portfolio.portfolioAddress}</p>
                <p>Created: {new Date(portfolio.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePortfolio; 