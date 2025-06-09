const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// Create a new portfolio
router.post('/', async (req, res) => {
  try {
    const {
      userAddress,
      portfolioId,
      portfolioAddress,
      name,
      symbol,
      owner,
      accessController,
      isPublicPortfolio,
      tokenExclusionManager,
      rebalancing,
      borrowManager,
      assetManagementConfig,
      feeModule,
      vaultAddress,
      gnosisModule,
      managementFee,
      performanceFee,
      entryFee,
      exitFee,
      initialAmount,
      minHolding,
      isPublic,
      isTransferable,
      isTransferableToPublic,
      whitelistTokens,
      whitelistedProtocolIds
    } = req.body;

    // Validate required fields
    if (!userAddress || !portfolioId || !portfolioAddress || !name || !symbol || !owner || !accessController) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if portfolio already exists
    const existingPortfolio = await Portfolio.findOne({ 
      $or: [
        { portfolioId },
        { portfolioAddress }
      ]
    });
    
    if (existingPortfolio) {
      return res.status(400).json({ message: 'Portfolio already exists' });
    }

    const portfolio = new Portfolio({
      userAddress,
      portfolioId,
      portfolioAddress,
      name,
      symbol,
      owner,
      accessController,
      isPublicPortfolio,
      tokenExclusionManager,
      rebalancing,
      borrowManager,
      assetManagementConfig,
      feeModule,
      vaultAddress,
      gnosisModule,
      managementFee,
      performanceFee,
      entryFee,
      exitFee,
      initialAmount,
      minHolding,
      isPublic,
      isTransferable,
      isTransferableToPublic,
      whitelistTokens,
      whitelistedProtocolIds
    });

    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (err) {
    console.error('Error creating portfolio:', err);
    res.status(500).json({ message: 'Error creating portfolio', error: err.message });
  }
});

// Get all portfolios for a user
router.get('/user/:userAddress', async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userAddress: req.params.userAddress });
    res.json(portfolios);
  } catch (err) {
    console.error('Error fetching portfolios:', err);
    res.status(500).json({ message: 'Error fetching portfolios', error: err.message });
  }
});

// Get a specific portfolio
router.get('/:portfolioId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ portfolioId: req.params.portfolioId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ message: 'Error fetching portfolio', error: err.message });
  }
});

// Update a portfolio
router.put('/:portfolioId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { portfolioId: req.params.portfolioId },
      { $set: req.body },
      { new: true }
    );
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (err) {
    console.error('Error updating portfolio:', err);
    res.status(500).json({ message: 'Error updating portfolio', error: err.message });
  }
});

// Delete a portfolio
router.delete('/:portfolioId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({ portfolioId: req.params.portfolioId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (err) {
    console.error('Error deleting portfolio:', err);
    res.status(500).json({ message: 'Error deleting portfolio', error: err.message });
  }
});

module.exports = router; 