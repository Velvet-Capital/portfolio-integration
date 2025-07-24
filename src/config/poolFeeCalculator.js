// scripts/utils/poolFeeCalculator.js
import { ethers } from "ethers";

export class PoolFeeCalculator {
  constructor(factoryAddress, chainId, venusAssetHandler) {
    this.pancakeSwapV3Factory = factoryAddress;
    this.chainId = chainId;
    this.venusAssetHandler = venusAssetHandler;
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
      
      const pool = new ethers.Contract(poolAddress, poolABI, ethers.provider);
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
      const factory = new ethers.Contract(this.pancakeSwapV3Factory, factoryABI, ethers.provider);
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