const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
    index: true
  },
  portfolioId: {
    type: Number,
    required: true,
    unique: true
  },
  portfolioAddress: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  accessController: {
    type: String,
    required: true
  },
  isPublicPortfolio: {
    type: Boolean,
    required: true
  },
  // Module addresses
  tokenExclusionManager: {
    type: String,
    required: true
  },
  rebalancing: {
    type: String,
    required: true
  },
  borrowManager: {
    type: String,
    required: true
  },
  assetManagementConfig: {
    type: String,
    required: true
  },
  feeModule: {
    type: String,
    required: true
  },
  vaultAddress: {
    type: String,
    required: true
  },
  gnosisModule: {
    type: String,
    required: true
  },
  // Fee configuration
  managementFee: {
    type: Number,
    required: true
  },
  performanceFee: {
    type: Number,
    required: true
  },
  entryFee: {
    type: Number,
    required: true
  },
  exitFee: {
    type: Number,
    required: true
  },
  // Portfolio configuration
  initialAmount: {
    type: String,
    required: true
  },
  minHolding: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    required: true
  },
  isTransferable: {
    type: Boolean,
    required: true
  },
  isTransferableToPublic: {
    type: Boolean,
    required: true
  },
  whitelistTokens: {
    type: Boolean,
    required: true
  },
  whitelistedProtocolIds: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', portfolioSchema); 