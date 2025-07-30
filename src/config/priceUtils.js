import { ethers } from 'ethers';
import { Contract, BigNumber } from 'ethers';
import { PORTFOLIO_ABI, ERC20_ABI, ASSET_MANAGEMENT_CONFIG_ABI, POSITION_MANAGER_ALGEBRA_ABI, EXTERNAL_POSITION_STORAGE_ABI, POSITION_WRAPPER_ABI, AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS } from './contracts';
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


        const scaledAllTokensUSD = allTokensUSD * BigInt(ethers.utils.parseEther('1'));
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