require('dotenv').config();

const contractConfig = {
  // Contract Addresses
  portfolioFactory: {
    address: process.env.PORTFOLIO_FACTORY_ADDRESS,
    abi: [
      "function createPortfolioNonCustodial(tuple(string _name, string _symbol, string _managementFee, string _performanceFee, string _entryFee, string _exitFee, string _initialPortfolioAmount, string _minPortfolioTokenHoldingAmount, address _assetManagerTreasury, address[] _whitelistedTokens, bool _public, bool _transferable, bool _transferableToPublic, bool _whitelistTokens, bytes32[] _witelistedProtocolIds)) returns (address)"
    ]
  },
  treasury: {
    address: process.env.TREASURY_ADDRESS
  },

  // Protocol Configuration
  thenaProtocol: {
    hash: process.env.THENA_PROTOCOL_HASH
  },

  // Network Configuration
  network: {
    id: process.env.NETWORK_ID || '1',
    rpcUrl: process.env.RPC_URL
  },

  // Default Fee Configuration
  fees: {
    management: process.env.DEFAULT_MANAGEMENT_FEE || '20',
    performance: process.env.DEFAULT_PERFORMANCE_FEE || '2500',
    entry: process.env.DEFAULT_ENTRY_FEE || '0',
    exit: process.env.DEFAULT_EXIT_FEE || '0'
  },

  // Default Portfolio Configuration
  portfolio: {
    initialAmount: process.env.DEFAULT_INITIAL_PORTFOLIO_AMOUNT || '100000000000000000000',
    minHoldingAmount: process.env.DEFAULT_MIN_PORTFOLIO_TOKEN_HOLDING || '10000000000000000'
  }
};

// Validation function to check if all required environment variables are set
const validateConfig = () => {
  const requiredVars = [
    'PORTFOLIO_FACTORY_ADDRESS',
    'TREASURY_ADDRESS',
    'THENA_PROTOCOL_HASH',
    'RPC_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Validate configuration on startup
validateConfig();

module.exports = contractConfig; 