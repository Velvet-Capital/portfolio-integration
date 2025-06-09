import { ethers } from 'ethers';
import { 
  PORTFOLIO_FACTORY_ADDRESS,
  TREASURY_ADDRESS,
  NETWORK_ID,
  RPC_URL,
  DEFAULT_FEES,
  DEFAULT_PORTFOLIO
} from '../config/contracts';

// ABI for the portfolio factory contract
const PORTFOLIO_FACTORY_ABI = [
  "function createPortfolioNonCustodial(address treasury, uint256 managementFee, uint256 performanceFee, uint256 entryFee, uint256 exitFee, uint256 initialAmount, uint256 minHolding, bool isPublic, bool isTransferable, bool isTransferableToPublic, bool whitelistTokens) external returns (address)",
  "function getPortfolioCount() external view returns (uint256)",
  "function getPortfolioByIndex(uint256 index) external view returns (address)",
  "function getPortfolioByAddress(address portfolioAddress) external view returns (bool)"
];

// Create a provider instance
export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(RPC_URL);
};

// Create a signer instance
export const getSigner = (provider) => {
  return new ethers.providers.Web3Provider(window.ethereum).getSigner();
};

// Get the portfolio factory contract instance
export const getPortfolioFactoryContract = (signer) => {
  return new ethers.Contract(
    PORTFOLIO_FACTORY_ADDRESS,
    PORTFOLIO_FACTORY_ABI,
    signer
  );
};

// Format address for display
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format amount with decimals
export const formatAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  return ethers.utils.formatUnits(amount, decimals);
};

// Parse amount to wei
export const parseAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  return ethers.utils.parseUnits(amount.toString(), decimals);
};

// Create a new portfolio
export const createPortfolio = async (
  signer,
  {
    treasury = TREASURY_ADDRESS,
    managementFee = DEFAULT_FEES.managementFee,
    performanceFee = DEFAULT_FEES.performanceFee,
    entryFee = DEFAULT_FEES.entryFee,
    exitFee = DEFAULT_FEES.exitFee,
    initialAmount = DEFAULT_PORTFOLIO.initialAmount,
    minHolding = DEFAULT_PORTFOLIO.minHolding,
    isPublic = true,
    isTransferable = true,
    isTransferableToPublic = true,
    whitelistTokens = false
  }
) => {
  try {
    const contract = getPortfolioFactoryContract(signer);
    
    // Convert amounts to wei
    const initialAmountWei = parseAmount(initialAmount);
    const minHoldingWei = parseAmount(minHolding);
    
    // Convert fees to basis points (1% = 100)
    const managementFeeBps = managementFee * 100;
    const performanceFeeBps = performanceFee * 100;
    const entryFeeBps = entryFee * 100;
    const exitFeeBps = exitFee * 100;

    // Estimate gas limit
    const gasEstimate = await contract.estimateGas.createPortfolioNonCustodial(
      treasury,
      managementFeeBps,
      performanceFeeBps,
      entryFeeBps,
      exitFeeBps,
      initialAmountWei,
      minHoldingWei,
      isPublic,
      isTransferable,
      isTransferableToPublic,
      whitelistTokens
    );

    // Add 20% buffer to gas estimate for safety
    const gasLimit = gasEstimate.mul(120).div(100);

    // Create the portfolio with gas limit
    const tx = await contract.createPortfolioNonCustodial(
      treasury,
      managementFeeBps,
      performanceFeeBps,
      entryFeeBps,
      exitFeeBps,
      initialAmountWei,
      minHoldingWei,
      isPublic,
      isTransferable,
      isTransferableToPublic,
      whitelistTokens,
      {
        gasLimit: gasLimit,
        // Optional: Set max fee per gas and max priority fee per gas for EIP-1559
        maxFeePerGas: ethers.utils.parseUnits("50", "gwei"), // 50 gwei
        maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"), // 2 gwei
      }
    );

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    // Get the portfolio address from the event
    const event = receipt.events.find(e => e.event === 'PortfolioCreated');
    const portfolioAddress = event.args.portfolioAddress;

    return {
      success: true,
      portfolioAddress,
      transactionHash: receipt.transactionHash,
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.effectiveGasPrice.toString()
    };
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get portfolio count
export const getPortfolioCount = async (signer) => {
  try {
    const contract = getPortfolioFactoryContract(signer);
    const count = await contract.getPortfolioCount();
    return parseInt(count.toString());
  } catch (error) {
    console.error('Error getting portfolio count:', error);
    return 0;
  }
};

// Get portfolio by index
export const getPortfolioByIndex = async (signer, index) => {
  try {
    const contract = getPortfolioFactoryContract(signer);
    const address = await contract.getPortfolioByIndex(index);
    return address;
  } catch (error) {
    console.error('Error getting portfolio by index:', error);
    return null;
  }
};

// Check if address is a portfolio
export const isPortfolio = async (signer, address) => {
  try {
    const contract = getPortfolioFactoryContract(signer);
    const isPortfolio = await contract.getPortfolioByAddress(address);
    return isPortfolio;
  } catch (error) {
    console.error('Error checking if address is portfolio:', error);
    return false;
  }
};

// Get network information
export const getNetworkInfo = async (provider) => {
  try {
    const network = await provider.getNetwork();
    return {
      chainId: network.chainId,
      name: network.name,
      isConnected: true
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return {
      chainId: null,
      name: null,
      isConnected: false
    };
  }
};

// Switch network to BNB Chain
export const switchToBNBChain = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${NETWORK_ID.toString(16)}` }],
    });
    return true;
  } catch (error) {
    if (error.code === 4902) {
      // Chain not added to MetaMask
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${NETWORK_ID.toString(16)}`,
            chainName: 'BNB Chain',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18
            },
            rpcUrls: [RPC_URL],
            blockExplorerUrls: ['https://bscscan.com']
          }]
        });
        return true;
      } catch (addError) {
        console.error('Error adding BNB Chain:', addError);
        return false;
      }
    }
    console.error('Error switching to BNB Chain:', error);
    return false;
  }
}; 