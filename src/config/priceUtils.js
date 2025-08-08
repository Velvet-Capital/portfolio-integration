import { ethers } from 'ethers';
import { Contract, BigNumber } from 'ethers';
import { PORTFOLIO_ABI, ERC20_ABI, ASSET_MANAGEMENT_CONFIG_ABI, POSITION_MANAGER_ALGEBRA_ABI, EXTERNAL_POSITION_STORAGE_ABI, POSITION_WRAPPER_ABI, AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, VENUS_ASSET_HANDLER_ABI, venusAssetHandlerAddress, AMOUNT_CALCULATIONS_ALGEBRA_ABI } from './contracts';
import axios from 'axios';
import { calculateOutputAmounts } from './helper';

// Mock getTokenPrice function - replace with your actual implementation
export async function fetchTokensDataByAddress(tokens) {
    console.log("Fetching tokens price data by address", tokens);
    try {
        const tokenInputs = tokens.map((token) => `"${token}"`).join('\n')

        const query = `
          query {
              filterTokens(
                  tokens: [${tokenInputs}],
                  filters: {
                  network: [56]
                  },
                  limit: 200
              ) {
                  results {
                      token {
                          address
                          decimals
                          name
                          networkId
                          symbol 
                          info {
                              imageSmallUrl
                          }
                      }
                      change1
                      change4
                      change12
                      change24
                      holders
                      txnCount24
                      createdAt
                      liquidity
                      marketCap
                      priceUSD
                      volume1
                      volume24
                      uniqueBuys24
                      uniqueSells24
                  }            
                }
          }
      `

        const response = await axios.post(
            'https://graph.defined.fi/graphql',
            { query },
            { headers: { Authorization: import.meta.env.VITE_CODEX_API_KEY } }
        )

        const result = response?.data?.data?.filterTokens?.results ?? []
        console.log("result", result);
        return result
    } catch (error) {
        console.error(`Failed to fetch tokens data by address: ${error}`)
        return []
    }
}

export const getIndexRate = async (
    portfolio,
) => {
    try {
        const provider = new ethers.providers.WebSocketProvider(
            import.meta.env.VITE_WSS_URL
        );

        const portfolioSwapInstance = new Contract(portfolio, PORTFOLIO_ABI, provider);

        const config = await portfolioSwapInstance.assetManagementConfig();
        const assetManagementConfig = new Contract(config, ASSET_MANAGEMENT_CONFIG_ABI, provider);


        let positionManagerAddress =
            await assetManagementConfig.lastDeployedPositionManager();

        const positionManager = new Contract(positionManagerAddress, POSITION_MANAGER_ALGEBRA_ABI, provider);

        const externalPositionStorage = new ethers.Contract(
            await positionManager.externalPositionStorage(),
            EXTERNAL_POSITION_STORAGE_ABI,
            provider
        );

        const [vaultAddress, tokens, totalSupply] = await Promise.all([
            portfolioSwapInstance.vault(),
            portfolioSwapInstance.getTokens(),
            portfolioSwapInstance.totalSupply(),
        ]);

        let positionTokens = {};
        let simpleTokens = []
        let finalTokens = [];
        let externalPositionTokens = [];
        const comptrollerAddress = "0xfD36E2c2a6789Db23113685031d7F16329158384";

        const venusAssetHandler = new ethers.Contract(
            venusAssetHandlerAddress,
            VENUS_ASSET_HANDLER_ABI,
            provider
        );

        // Lend Tokens and borrow tokens
        const [accountData, ] =
            await venusAssetHandler.callStatic.getUserAccountData(
                vaultAddress,
                comptrollerAddress,
                []
            );

        for (const token of tokens) {
            if (await externalPositionStorage.isWrappedPosition(token)) {
                const positionWrapper = new ethers.Contract(
                    token,
                    POSITION_WRAPPER_ABI,
                    provider
                );

                const token0 = await positionWrapper.token0();
                const token1 = await positionWrapper.token1();

                positionTokens[token] = {
                    token0,
                    token1,
                };
                finalTokens.push(token0, token1);
                externalPositionTokens.push(token);
            } else {
                simpleTokens.push(token);
                finalTokens.push(token);
            }
        }


        finalTokens = [...new Set(finalTokens.map(token => token.toLowerCase()))];


        const tokenDetails = await fetchTokensDataByAddress(finalTokens);

        let allTokensUSD = BigInt('0');

        const totalDebt = BigInt(accountData.totalDebt.div(BigInt(ethers.BigNumber.from(10).pow(10))));

        for (const token of tokens) {

            if (!externalPositionTokens.includes(token)) {
                const tokenInstance = new Contract(token, ERC20_ABI, provider);

                const [amount, decimal] = await Promise.all([
                    tokenInstance.balanceOf(vaultAddress),
                    tokenInstance.decimals(),
                ]);
                console.log("token", token);
                console.log("vaultAddress", vaultAddress);
                console.log("amount", amount);

                let tokenAmount = BigInt('0');

                if (+decimal.toString() < 18) {
                    const difference = 18 - +decimal.toString();

                    let scale = BigInt(1);
                    for (let i = 0; i < difference; i++) {
                        scale *= BigInt(10);
                    }
                    tokenAmount = BigInt(amount) * scale;
                } else if (+decimal.toString() > 18) {
                    const difference = +decimal.toString() - 18;
                    let scale = BigInt(1);
                    for (let i = 0; i < difference; i++) {
                        scale *= BigInt(10);
                    }
                    tokenAmount = BigInt(amount) / scale;
                } else {
                    tokenAmount = amount;
                }

                const price = tokenDetails.find(tokenDetail => tokenDetail.token.address.toLowerCase() === token.toLowerCase())?.priceUSD;
                console.log("price", price);
                if (price) {
                    const tokenPrice = ethers.utils.parseEther(price.toString());
                    console.log("tokenPrice", tokenPrice);
                    const tokenUSDAmount = (BigInt(tokenAmount) * BigInt(tokenPrice)) / BigInt(ethers.utils.parseEther('1'));
                    allTokensUSD = allTokensUSD + tokenUSDAmount;
                }
            } else {
                const token0 = positionTokens[token].token0;
                const token1 = positionTokens[token].token1;

                const tokenAmounts = await calculateOutputAmounts(token, AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, "10000");

                const priceToken0 = tokenDetails.find(tokenDetail => tokenDetail.token.address.toLowerCase() === token0.toLowerCase())?.priceUSD;
                if (priceToken0) {
                    const tokenPrice = ethers.utils.parseEther(priceToken0.toString());
                    const tokenUSDAmount = (BigInt(tokenAmounts.token0Amount) * BigInt(tokenPrice)) / BigInt(ethers.utils.parseEther('1'));
                    allTokensUSD = allTokensUSD + tokenUSDAmount;
                }
                const priceToken1 = tokenDetails.find(tokenDetail => tokenDetail.token.address.toLowerCase() === token1.toLowerCase())?.priceUSD;
                if (priceToken1) {
                    const tokenPrice = ethers.utils.parseEther(priceToken1.toString());
                    const tokenUSDAmount = (BigInt(tokenAmounts.token1Amount) * BigInt(tokenPrice)) / BigInt(ethers.utils.parseEther('1'));
                    allTokensUSD = allTokensUSD + tokenUSDAmount;
                }
            }
        }


        const scaledAllTokensUSD = (allTokensUSD - totalDebt) * BigInt(ethers.utils.parseEther('1'));
        const indexRate = scaledAllTokensUSD / BigInt(totalSupply);

        return indexRate.toString();
    } catch (err) {
        throw err;
    }
};

// Helper function to get user's invested value in USD and portfolio token balance
export const getUserInvestedValue = async (portfolioAddress, userAddress, chainId = 56) => {
    try {
        const provider = new ethers.providers.WebSocketProvider(import.meta.env.VITE_WSS_URL);

        const portfolioContract = new Contract(portfolioAddress, PORTFOLIO_ABI, provider);

        // Get user's portfolio token balance
        const userBalance = await portfolioContract.balanceOf(userAddress);

        // Get index rate
        const indexRate = await getIndexRate(portfolioAddress, chainId);

        // Calculate user's invested value: userBalance * indexRate
        const userInvestedValue = (BigInt(userBalance) * BigInt(indexRate)) / BigInt(ethers.utils.parseEther('1'));

        return {
            userBalance: ethers.utils.formatEther(userBalance),
            userInvestedValue: ethers.utils.formatEther(userInvestedValue)
        };
    } catch (err) {
        console.error('Error getting user invested value:', err);
        return {
            userBalance: '0',
            userInvestedValue: '0'
        };
    }
};

export const isExternalPosition = async (tokenAddress, portfolioContract) => {
    try {
      const config = await portfolioContract.assetManagementConfig();
      const assetManagementConfig = new ethers.Contract(
        config, 
        ASSET_MANAGEMENT_CONFIG_ABI, 
        portfolioContract.provider
      );

      const positionManagerAddress = await assetManagementConfig.lastDeployedPositionManager();
      const positionManager = new ethers.Contract(
        positionManagerAddress, 
        POSITION_MANAGER_ALGEBRA_ABI, 
        portfolioContract.provider
      );

      const externalPositionStorage = new ethers.Contract(
        await positionManager.externalPositionStorage(),
        EXTERNAL_POSITION_STORAGE_ABI,
        portfolioContract.provider
      );

      const isWrapped = await externalPositionStorage.isWrappedPosition(tokenAddress);
      
      if (isWrapped) {
        const positionWrapper = new ethers.Contract(
          tokenAddress,
          POSITION_WRAPPER_ABI,
          portfolioContract.provider
        );

        const token0 = await positionWrapper.token0();
        const token1 = await positionWrapper.token1();

        return {
          isExternal: true,
          token0,
          token1
        };
      } else {
        return {
          isExternal: false,
          token0: null,
          token1: null
        };
      }
    } catch (error) {
      console.error("Error checking if token is external position:", error);
      return {
        isExternal: false,
        token0: null,
        token1: null
      };
    }
  };

  export const calculateDepositAmounts = async (
    position,
    newTickLower,
    newTickUpper,
    inputAmount
) => {

    const provider = new ethers.providers.WebSocketProvider(import.meta.env.VITE_WSS_URL);
    
    const amountCalculationsAlgebra = new ethers.Contract(AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, AMOUNT_CALCULATIONS_ALGEBRA_ABI, provider);
    // Get amounts for new price range (to calculate the ratio)
    let amounts =
        await amountCalculationsAlgebra.callStatic.getRatioAmountsForTicks(
            position,
            newTickLower,
            newTickUpper
        );

    // Convert amount0, amount1 to USD (here we use stable coins for testing so we can skip)

    // Get the ratios the tokens should be swapped to
    let ratio0 =
        Number(BigNumber.from(amounts.amount0)) /
        Number(
            BigNumber.from(amounts.amount0).add(BigNumber.from(amounts.amount1))
        );
    let ratio1 =
        Number(BigNumber.from(amounts.amount1)) /
        Number(
            BigNumber.from(amounts.amount0).add(BigNumber.from(amounts.amount1))
        );

    let amount0 = (Number(BigNumber.from(inputAmount)) * ratio0).toFixed(0);
    let amount1 = (Number(BigNumber.from(inputAmount)) * ratio1).toFixed(0);

    return { amount0, amount1 };
}