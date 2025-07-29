// scripts/utils/poolFeeCalculator.js
import { ethers } from "ethers";

export class PoolFeeCalculator {

  static PAIRING_TOKENS = [
    // Major Stablecoins (highest priority)
    "0x55d398326f99059ff775485246999027b3197955", // USDT
    "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // USDC
    "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3", // DAI
    
    // Major Cryptocurrencies
    "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", // WBNB
    "0x2170ed0880ac9a755fd29b2688956bd959f933f8", // ETH
    "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c", // BTC
    
    // Popular DeFi Tokens
    "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", // CAKE
    "0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95", // APE
    "0x965f527d9159dce6288a2219db51fc6eef120dd1", // BSW
    
    // Add more tokens here as needed...
    // "0x...", // TOKEN_NAME
  ];

  constructor(factoryAddress, chainId, venusAssetHandler) {
    this.pancakeSwapV3Factory = factoryAddress;
    this.chainId = chainId;
    this.venusAssetHandler = venusAssetHandler;
    // Create provider instance
    this.provider = new ethers.providers.JsonRpcProvider(
      import.meta.env.VITE_RPC_URL
    );
  }

  async selectOptimalFlashLoanToken(
    borrowTokens,
    lendTokens,
    addresses
  ) {
    console.log("🔍 Selecting optimal flash loan token and Thena pool...");
    
    if (borrowTokens.length === 0) {
      return {
        flashLoanProtocolToken: addresses.vUSDT_Address,
        flashLoanToken: addresses.USDT,
        thenaFactory: "0x306F06C147f064A010530292A1EB6737c3e378e4",
        thenaToken0: addresses.USDT,
        thenaToken1: addresses.USDC_Address
      };
    }
    
    if (borrowTokens.length === 1) {
      const underlyingTokens = await this.getUnderlyingTokens([borrowTokens[0]]);
      const flashLoanToken = underlyingTokens[0];
      
      const bestPool = await this.findBestThenaPool(flashLoanToken, addresses);
      
      return {
        flashLoanProtocolToken: borrowTokens[0],
        flashLoanToken: flashLoanToken,
        thenaFactory: bestPool.factory,
        thenaToken0: bestPool.token0,
        thenaToken1: bestPool.token1
      };
    }
    
    // Multiple borrowed tokens - find the best one
    const tokenAnalyses = await this.analyzeTokensForFlashLoan(borrowTokens, lendTokens, addresses);
    const bestToken = tokenAnalyses.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    return {
      flashLoanProtocolToken: bestToken.vToken,
      flashLoanToken: bestToken.token,
      thenaFactory: bestToken.thenaFactory,
      thenaToken0: bestToken.thenaToken0,
      thenaToken1: bestToken.thenaToken1
    };
  }

  /**
   * Find the best Thena pool for a flash loan token
   */
  async findBestThenaPool(
    flashLoanToken, 
    addresses
  ){
    console.log(` Finding best Thena pool for flash loan token: ${flashLoanToken}`);
    
    // Use our pairing tokens list
    const candidateTokens = PoolFeeCalculator.PAIRING_TOKENS;
    
    console.log(`📊 Checking ${candidateTokens.length} candidate tokens for pairing`);
    
    // Try each candidate token - flash loan token MUST be one of the pool tokens
    for (const candidateToken of candidateTokens) {
      if (candidateToken.toLowerCase() !== flashLoanToken.toLowerCase()) {
        console.log(`🔍 Checking pool: ${flashLoanToken} - ${candidateToken}`);
        const poolExists = await this.checkThenaPoolExists(flashLoanToken, candidateToken);
        if (poolExists) {
          // flashLoanToken MUST be one of the pool tokens
          const [token0, token1] = this.sortTokens(flashLoanToken, candidateToken);
          console.log(`✅ Found Thena pool: ${token0} - ${token1}`);
          console.log(`✅ Flash loan token ${flashLoanToken} is in this pool`);
          return {
            factory: "0x306F06C147f064A010530292A1EB6737c3e378e4",
            token0: token0,
            token1: token1
          };
        }
      }
    }
    
    // Fallback - find any pool that contains the flash loan token
    console.log(`⚠️ No suitable pool found in pairing list, trying to find any pool with ${flashLoanToken}`);
    
    // Try common stablecoins to pair with flash loan token
    const fallbackTokens = [
      addresses.USDT,
      addresses.USDC_Address,
      addresses.DAI_Address,
      "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", // WBNB
    ];
    
    for (const fallbackToken of fallbackTokens) {
      if (fallbackToken.toLowerCase() !== flashLoanToken.toLowerCase()) {
        const poolExists = await this.checkThenaPoolExists(flashLoanToken, fallbackToken);
        if (poolExists) {
          const [token0, token1] = this.sortTokens(flashLoanToken, fallbackToken);
          console.log(`✅ Found fallback pool: ${token0} - ${token1}`);
          return {
            factory: "0x306F06C147f064A010530292A1EB6737c3e378e4",
            token0: token0,
            token1: token1
          };
        }
      }
    }
    
    // Final fallback - use a pool that definitely contains the flash loan token
    console.log(`⚠️ No pool found with ${flashLoanToken}, using default pool`);
    return {
      factory: "0x306F06C147f064A010530292A1EB6737c3e378e4",
      token0: flashLoanToken, // Ensure flash loan token is in the pool
      token1: addresses.USDT,  // Pair with USDT
    };
  }

  /**
   * Check if a Thena pool exists
   */
  async checkThenaPoolExists(token0, token1) {
    try {
      const [sortedToken0, sortedToken1] = this.sortTokens(token0, token1);
      
      const thenaFactoryABI = [
        "function poolByPair(address _token0, address _token1) external view returns (address)"
      ];
      
      const thenaFactory = new ethers.Contract(
        "0x306F06C147f064A010530292A1EB6737c3e378e4",
        thenaFactoryABI,
        this.provider // FIXED: Use this.provider instead of ethers.provider
      );
      
      const poolAddress = await thenaFactory.poolByPair(sortedToken0, sortedToken1);
      
      if (poolAddress !== "0x0000000000000000000000000000000000000000") {
        // Just check if pool exists, don't worry about exact liquidity
        console.log(`✅ Pool exists at: ${poolAddress}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.log(`❌ Error checking Thena pool: ${error.message}`);
      return false;
    }
  }

  /**
   * Get pool liquidity
   */
  async getPoolLiquidity(poolAddress) {
    try {
      const poolABI = [
        "function liquidity() view returns (uint128)"
      ];
      
      const pool = new ethers.Contract(poolAddress, poolABI, this.provider);
      const liquidity = await pool.liquidity();
      return liquidity.toNumber();
    } catch (error) {
      console.log(`❌ Error getting pool liquidity: ${error.message}`);
      return 0;
    }
  }

  /**
   * Analyze tokens for flash loan selection
   */
  async analyzeTokensForFlashLoan(borrowTokens, lendTokens, addresses) {
    const analyses = [];
    
    for (const vToken of borrowTokens) {
      const underlyingToken = await this.getUnderlyingTokens([vToken]);
      const token = underlyingToken[0];
      
      const bestPool = await this.findBestThenaPool(token, addresses);
      
      // Simple scoring based on pool availability
      let score = 0;
      if (bestPool.token0 !== addresses.USDT || bestPool.token1 !== addresses.USDC_Address) {
        score = 100; // Good pool found
      } else {
        score = 50; // Using fallback pool
      }
      
      analyses.push({
        vToken,
        token,
        score,
        thenaFactory: bestPool.factory,
        thenaToken0: bestPool.token0,
        thenaToken1: bestPool.token1
      });
    }
    
    return analyses;
  }

  /**
   * Get optimal pool fees for withdrawal scenarios
   */
  async getPoolFeesForWithdrawal(
    flashLoanToken,
    vDebtTokens, // Venus debt tokens (vToken format)
    vLendTokens, // Venus lend tokens (vToken format)
    addresses
  ) {
    console.log("🔍 Calculating pool fees for withdrawal...");
  
    // Get underlying tokens from vTokens
    const debtTokens = await this.getUnderlyingTokens(vDebtTokens);
    const lendTokens = await this.getUnderlyingTokens(vLendTokens);
  
    const allPoolFees = []; // Changed to single array
  
    // Step 1: Calculate flash loan → debt token pool fees
    for (const debtToken of debtTokens) {
      if (debtToken.toLowerCase() === flashLoanToken.toLowerCase()) {
        console.log(`✅ No swap needed: ${debtToken} = flash loan token`);
      } else {
        const optimalFee = await this.getOptimalPoolFeeWithTVL(flashLoanToken, debtToken);
        console.log(`💰 Flash loan → ${debtToken}: fee ${optimalFee}`);
        allPoolFees.push(optimalFee); // Push to single array
      }
    }
  
    // Step 2: Calculate collateral → flash loan token pool fees
    for (const lendToken of lendTokens) {
      if (lendToken.toLowerCase() === flashLoanToken.toLowerCase()) {
        console.log(`✅ No swap needed: ${lendToken} = flash loan token`);
      } else {
        const optimalFee = await this.getOptimalPoolFeeWithTVL(lendToken, flashLoanToken);
        console.log(`💰 ${lendToken} → Flash loan: fee ${optimalFee}`);
        allPoolFees.push(optimalFee); // Push to single array
      }
    }
  
    return { poolFees: [allPoolFees] }; // Return as nested array
  }

  /**
   * Get underlying tokens from vTokens
   */
  async getUnderlyingTokens(vTokens) {
    const underlyingTokens = [];
    
    for (const vToken of vTokens) {
      try {
        // Check if it's vBNB (special case)
        if (vToken.toLowerCase() === "0xA07c5b74C9B40447a954e1466938b865b6BBea36".toLowerCase()) {
          underlyingTokens.push("0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"); // WBNB
        } else {
          // Get underlying token from Venus pool
          const underlying = await this.venusAssetHandler.getUnderlyingToken(vToken);
          underlyingTokens.push(underlying);
        }
      } catch (error) {
        console.log(`❌ Failed to get underlying for ${vToken}: ${error.message}`);
        underlyingTokens.push(vToken);
      }
    }
    
    return underlyingTokens;
  }

  /**
   * Get optimal pool fee with highest TVL for a token pair
   */
  async getOptimalPoolFeeWithTVL(token0, token1) {
    const [sortedToken0, sortedToken1] = this.sortTokens(token0, token1);
    const commonFees = [500, 100, 2500, 10000]; // Check in order of preference
    const poolInfos = [];
    
    for (const fee of commonFees) {
      try {
        const poolInfo = await this.getPoolInfo(sortedToken0, sortedToken1, fee);
        if (poolInfo.tvl > 0) {
          poolInfos.push(poolInfo);
        }
      } catch (error) {
        // Pool not found, continue to next fee
      }
    }

    if (poolInfos.length === 0) {
      console.log(`⚠️ No pools found, using default fee 500`);
      return 500;
    }

    // Sort by TVL (highest first) and return the best fee
    poolInfos.sort((a, b) => b.tvl - a.tvl);
    const bestPool = poolInfos[0];
    console.log(`🏆 Best pool: fee ${bestPool.fee} (TVL: ${bestPool.tvl > 1000 ? 'Very High' : bestPool.tvl})`);
    return bestPool.fee;
  }

  /**
   * Get pool info including TVL
   */
  async getPoolInfo(token0, token1, fee) {
    const poolAddress = await this.getPoolAddress(token0, token1, fee);
    
    if (poolAddress === "0x0000000000000000000000000000000000000000") {
      return { fee, tvl: 0, poolAddress };
    }

    try {
      const poolABI = [
        "function liquidity() view returns (uint128)",
        "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"
      ];
      
      const pool = new ethers.Contract(poolAddress, poolABI, this.provider); // Use this.provider
      const liquidity = await pool.liquidity();
      
      let tvl;
      try {
        tvl = liquidity.toNumber();
      } catch (error) {
        // Handle overflow by using fee-based TVL values
        if (fee === 500) {
          tvl = 10000; // Highest preference for 0.05%
        } else if (fee === 100) {
          tvl = 8000;  // Second preference for 0.01%
        } else if (fee === 2500) {
          tvl = 6000;  // Third preference for 0.25%
        } else {
          tvl = 4000;  // Lowest preference for 1%
        }
      }
      
      return { fee, tvl, poolAddress };
    } catch (error) {
      return { fee, tvl: 0, poolAddress };
    }
  }

  /**
   * Get pool address from factory
   */
  async getPoolAddress(token0, token1, fee) {
    try {
      const factoryABI = ["function getPool(address, address, uint24) view returns (address)"];
      const factory = new ethers.Contract(this.pancakeSwapV3Factory, factoryABI, this.provider); // Use this.provider
      return await factory.getPool(token0, token1, fee);
    } catch (error) {
      return "0x0000000000000000000000000000000000000000";
    }
  }

  /**
   * Sort tokens to ensure consistent ordering
   */
  sortTokens(token0, token1) {
    return token0.toLowerCase() < token1.toLowerCase() 
      ? [token0, token1] 
      : [token1, token0];
  }
}

// Export function for use in withdraw script
export async function calculatePoolFeesForWithdrawal(
  flashLoanToken,
  vDebtTokens,
  vLendTokens,
  addresses,
  chainId,
  venusAssetHandler
) {
  const calculator = new PoolFeeCalculator(addresses.PancakeSwapV3FactoryAddress, chainId, venusAssetHandler);
  return await calculator.getPoolFeesForWithdrawal(flashLoanToken, vDebtTokens, vLendTokens, addresses);
}