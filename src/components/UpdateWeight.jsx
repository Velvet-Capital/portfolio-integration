import { useState, useEffect } from "react";
import { useMetaMask } from "../contexts/MetaMaskContext";
import { ethers } from "ethers";
import { BigNumber } from "ethers";
import { createEnsoCallDataRoute, calculateOutputAmounts, createEncodedParametersDecreaseLiquidity, createEncodedParametersDecreaseLiquidityWithSwap, createEncodedParametersIncreaseLiquidity, getTokenAmountOut, getEncodedDataForPositionLiquidityIncrease,getEncodedDataForPositionLiquidityDecrease } from "../config/helper";
import { isExternalPosition, calculateDepositAmounts } from "../config/priceUtils";
import { ENSO_HANDLER_ADDRESS, PORTFOLIO_ABI, REBALANCING_ABI, ERC20_ABI, AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, AMOUNT_CALCULATIONS_ALGEBRA_ABI, POSITION_WRAPPER_ABI, ZERO_ADDRESS, priceOracleAddress } from "../config/contracts";

import "./UpdateWeight.css";

const UpdateWeight = ({ portfolio }) => {
    const { account, connect } = useMetaMask();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
    const [tokenIn, setTokenIn] = useState("");
    const [tokenOut, setTokenOut] = useState("");
    const [portfolioTokens, setPortfolioTokens] = useState([]);
    const [loadingTokens, setLoadingTokens] = useState(false);
    const [tokenDetails, setTokenDetails] = useState({});
    const [rebalancePercentage, setRebalancePercentage] = useState("100");

    // Helper function to parse comma-separated token addresses
    const parseTokenArray = (tokenString) => {
        if (!tokenString.trim()) return [];
        return tokenString.split(',').map(token => token.trim()).filter(token => token.length > 0);
    };


    // Function to fetch portfolio tokens
    const fetchPortfolioTokens = async () => {
        if (!portfolio || !portfolio.portfolioAddress) {
            console.log("No portfolio or portfolio address provided");
            return;
        }

        setLoadingTokens(true);
        try {
            console.log("Fetching tokens for portfolio:", portfolio.portfolioAddress);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const portfolioContract = new ethers.Contract(
                portfolio.portfolioAddress,
                PORTFOLIO_ABI,
                provider
            );

            const tokens = await portfolioContract.getTokens();
            console.log("Fetched tokens:", tokens);
            setPortfolioTokens(tokens);

            // Get details for each token
            const details = {};
            for (const token of tokens) {
                try {
                    const tokenInfo = await isExternalPosition(token, portfolioContract);
                    details[token] = tokenInfo;
                } catch (error) {
                    console.error(`Error getting details for token ${token}:`, error);
                    details[token] = { isExternal: false, token0: null, token1: null };
                }
            }
            setTokenDetails(details);
        } catch (error) {
            console.error("Error fetching portfolio tokens:", error);
            setError("Failed to fetch portfolio tokens: " + error.message);
        } finally {
            setLoadingTokens(false);
        }
    };

    useEffect(() => {
        // Check if MetaMask is installed
        const checkMetaMask = () => {
            const isInstalled = window.ethereum && window.ethereum.isMetaMask;
            setIsMetaMaskInstalled(isInstalled);
        };
        checkMetaMask();

        // Fetch portfolio tokens when component mounts
        fetchPortfolioTokens();
    }, [portfolio]);



    const handleUpdateWeights = async () => {
        if (!isMetaMaskInstalled) {
            setError(
                "MetaMask is not installed. Please install MetaMask to use this feature."
            );
            return;
        }

        if (!account) {
            try {
                await connect();
            } catch (err) {
                setError(
                    "Failed to connect to MetaMask. Please make sure MetaMask is unlocked and try again."
                );
                return;
            }
            return;
        }



        setLoading(true);
        setError(null);
        setSuccess(false);
        setNotification("Starting weight update process...");

        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Get portfolio contract
            const portfolioContract = new ethers.Contract(
                portfolio.portfolioAddress,
                PORTFOLIO_ABI,
                signer
            );

            // Get rebalancing contract
            const rebalancingContract = new ethers.Contract(
                portfolio.rebalancing,
                REBALANCING_ABI,
                signer
            );

            // Parse token arrays
            const sellTokens = parseTokenArray(tokenIn);
            const buyTokens = parseTokenArray(tokenOut);

            if (sellTokens.length === 0) {
                setError("Please enter a valid token address to sell");
                return;
            }

            // Validate rebalance percentage
            const percentage = parseFloat(rebalancePercentage);
            if (isNaN(percentage) || percentage < 1 || percentage > 100) {
                setError("Please enter a valid percentage between 1 and 100");
                return;
            }

            let newTokens = [];

            if (sellTokens.length === 1 && buyTokens.length === 1) {
                let sellToken = sellTokens[0];
                let buyToken = buyTokens[0];

                // Get underlying amounts for sell token
                const sellTokenInfo = await isExternalPosition(sellToken, portfolioContract);
                const buyTokenInfo = await isExternalPosition(buyToken, portfolioContract);
                if (sellTokenInfo.isExternal && buyTokenInfo.isExternal) {
                    setError("Cannot tokenIn and tokenOut be external positions");
                    return
                }

                if (sellTokenInfo.isExternal) {
                    //case 1st : position to ERC20
                    const tokens = await portfolioContract.getTokens();

                    const vault = await portfolioContract.vault();

                    const sellTokenContract = new ethers.Contract(
                        sellToken,
                        ERC20_ABI,
                        signer
                    );

                    const sellTokenBalance = await sellTokenContract.balanceOf(vault);

                    if (tokens.indexOf(sellToken) === -1) {
                        setError("Sell token not found in portfolio");
                        return;
                    } else {
                        newTokens = tokens.filter(token => rebalancePercentage == 100 ? token !== sellToken : true);
                        if (newTokens.indexOf(buyToken) === -1) {
                            newTokens.push(buyToken);
                        }
                    }
                    // Calculate the actual amount to sell based on rebalance percentage
                    const percentageBN = ethers.BigNumber.from(rebalancePercentage);
                    const totalBalanceBN = ethers.BigNumber.from(sellTokenBalance);
                    const actualSellAmount = totalBalanceBN.mul(percentageBN).div(100);

                    const encodedParameters = await createEncodedParametersDecreaseLiquidityWithSwap(sellToken, actualSellAmount, buyToken, ENSO_HANDLER_ADDRESS, AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, ZERO_ADDRESS)



                    const tnx = await rebalancingContract.updateTokens({
                        _newTokens: newTokens,
                        _sellTokens: [sellToken],
                        _sellAmounts: [actualSellAmount],
                        _handler: ENSO_HANDLER_ADDRESS,
                        _callData: encodedParameters,
                    }, {
                        gasLimit: 2500000,
                    });
                    await tnx.wait();
                    setSuccess(true);
                    setNotification("Portfolio weights updated successfully!");
                } else if (buyTokenInfo.isExternal) {
                    //case 2nd : ERC20 to position
                    const tokens = await portfolioContract.getTokens();


                    const vault = await portfolioContract.vault();

                    const sellTokenContract = new ethers.Contract(
                        sellToken,
                        ERC20_ABI,
                        signer
                    );

                    const sellTokenBalance = await sellTokenContract.balanceOf(vault);

                    if (tokens.indexOf(sellToken) === -1) {
                        setError("Sell token not found in portfolio");
                        return;
                    } else {
                        newTokens = tokens.filter(token => rebalancePercentage == 100 ? token !== sellToken : true);
                        if (newTokens.indexOf(buyToken) === -1) {
                            newTokens.push(buyToken);
                        }
                    }





                    // Calculate the actual amount to sell based on rebalance percentage
                    const percentageBN = ethers.BigNumber.from(rebalancePercentage);
                    const totalBalanceBN = ethers.BigNumber.from(sellTokenBalance);
                    const actualSellAmount = totalBalanceBN.mul(percentageBN).div(100);
                    // console.log("actualSellAmount", actualSellAmount);

                    // const actualSellAmount2 = ethers.BigNumber.from(sellTokenBalance).sub(ethers.BigNumber.from(1000));

                    console.log("buyTokenInfo", buyTokenInfo);

                    const shouldSwap = buyTokenInfo.token0 !== sellToken || buyTokenInfo.token1 !== sellToken

                    const encodedParameters = await createEncodedParametersIncreaseLiquidity(buyToken, [sellToken], [actualSellAmount], ENSO_HANDLER_ADDRESS, AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, await signer.getAddress(), priceOracleAddress, shouldSwap)

                    console.log({
                        _newTokens: newTokens,
                        _sellTokens: [sellToken],
                        _sellAmounts: [actualSellAmount],
                        _handler: ENSO_HANDLER_ADDRESS,
                        _callData: encodedParameters,
                    })
                    const tnx = await rebalancingContract.updateTokens({
                        _newTokens: newTokens,
                        _sellTokens: [sellToken],
                        _sellAmounts: [actualSellAmount],
                        _handler: ENSO_HANDLER_ADDRESS,
                        _callData: encodedParameters,
                    }, {
                        gasLimit: 2500000,
                    });
                    await tnx.wait();
                    setSuccess(true);
                    setNotification("Portfolio weights updated successfully!");
                }

            } else if (sellTokens.length === 2 && buyTokens.length === 1) {
                //case 3rd : underlying to position                
                const buyToken = buyTokens[0];

                const buyTokenInfo = await isExternalPosition(buyToken, portfolioContract);

                if (!buyTokenInfo.isExternal) {
                    setError("Cannot buy token should be external position");
                    return;
                }

                // Check if buyTokenInfo.token0 and buyTokenInfo.token1 match the sell tokens
                const sellToken0 = sellTokens[0];
                const sellToken1 = sellTokens[1];

                // Check if the underlying tokens of the buy position match the sell tokens
                if ((buyTokenInfo.token0 !== sellToken0 && buyTokenInfo.token0 !== sellToken1) ||
                    (buyTokenInfo.token1 !== sellToken0 && buyTokenInfo.token1 !== sellToken1)) {
                    setError("Buy token underlying tokens (token0 and token1) must match the sell tokens");
                    return;
                }

                // Verify that both sell tokens are different
                if (sellToken0 === sellToken1) {
                    setError("Sell tokens must be different");
                    return;
                }


                const tokens = await portfolioContract.getTokens();



               

                const vault = await portfolioContract.vault();

                const sellToken0Contract = new ethers.Contract(sellToken0, ERC20_ABI, signer);
                const sellToken1Contract = new ethers.Contract(sellToken1, ERC20_ABI, signer);

                const sellToken0Balance = await sellToken0Contract.balanceOf(vault);
                const sellToken1Balance = await sellToken1Contract.balanceOf(vault);

                // Calculate the actual amounts to sell based on rebalance percentage
                const percentageBN = ethers.BigNumber.from(rebalancePercentage);
                const actualSellToken0Amount = ethers.BigNumber.from(sellToken0Balance).mul(percentageBN).div(100);

                const isSellToken1Token0 = buyTokenInfo.token0 === sellToken1;

                const requiredSellToken1Amount = await getTokenAmountOut(buyToken, actualSellToken0Amount, isSellToken1Token0, AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, signer);
                console.log({
                    sellToken0Balance,
                    sellToken1Balance,
                    actualSellToken0Amount
                })
                console.log("requiredSellToken1Amount", requiredSellToken1Amount);

                if (requiredSellToken1Amount.gt(sellToken1Balance)) {
                    setError("Sell token1 balance is not enough");
                    return;
                }

                if(requiredSellToken1Amount.eq(sellToken1Balance)){
                    if(rebalancePercentage == 100){
                        newTokens = tokens.filter(token => token !== sellToken0 && token !== sellToken1);
                    } else {
                        newTokens = tokens.filter(token =>  token !== sellToken1);
                    }
                } else {
                    if(rebalancePercentage == 100){
                        newTokens = tokens.filter(token => token !== sellToken0);
                    } else {
                        newTokens = tokens
                    }
                }




                const rebalanceAmount0 = isSellToken1Token0 ? requiredSellToken1Amount : actualSellToken0Amount;
                const rebalanceAmount1 = isSellToken1Token0 ? actualSellToken0Amount : requiredSellToken1Amount;     






                const encodedParameters = await getEncodedDataForPositionLiquidityIncrease(buyToken, rebalanceAmount0, rebalanceAmount1 , ENSO_HANDLER_ADDRESS, AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, await signer.getAddress(), priceOracleAddress)


                console.log("buyToken", buyTokenInfo);
                console.log("rebalanceAmount0", rebalanceAmount0.toString());
                console.log("rebalanceAmount1", rebalanceAmount1.toString());

                console.log("newTokens", newTokens);

                const tnx = await rebalancingContract.updateTokens({
                    _newTokens: newTokens,
                    _sellTokens: [buyTokenInfo.token0, buyTokenInfo.token1],
                    _sellAmounts: [rebalanceAmount0, rebalanceAmount1],
                    _handler: ENSO_HANDLER_ADDRESS,
                    _callData: encodedParameters,
                }, {
                    gasLimit: 2500000,
                });
                await tnx.wait();
                setSuccess(true);
                setNotification("Portfolio weights updated successfully!");


            } else if (sellTokens.length === 1 && buyTokens.length === 2) {
                //case 4th : position to underlying
                const sellToken = sellTokens[0];
                const sellTokenInfo = await isExternalPosition(sellToken, portfolioContract);

                if (!sellTokenInfo.isExternal) {
                    setError("Cannot sell token should be external position");
                    return;
                }

                const buyToken0 = buyTokens[0];
                const buyToken1 = buyTokens[1];

                let tokens = await portfolioContract.getTokens();
                if(rebalancePercentage == 100){
                    newTokens = tokens.filter(token => token !== sellToken);
                    newTokens = [...newTokens, buyToken0, buyToken1]
                } else {
                    newTokens = [...tokens, buyToken0, buyToken1]
                }

                const vault = await portfolioContract.vault();

                const sellTokenContract = new ethers.Contract(sellToken, ERC20_ABI, signer);

                const sellTokenBalance = await sellTokenContract.balanceOf(vault);  

                const percentageBN = ethers.BigNumber.from(rebalancePercentage);
                const actualSellTokenAmount = ethers.BigNumber.from(sellTokenBalance).mul(percentageBN).div(100);

                const encodedParameters = await getEncodedDataForPositionLiquidityDecrease(sellToken, actualSellTokenAmount, ENSO_HANDLER_ADDRESS, AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, await signer.getAddress(), priceOracleAddress)


                 const tnx = await rebalancingContract.updateTokens({
                    _newTokens: newTokens,
                    _sellTokens: [sellToken],
                    _sellAmounts: [actualSellTokenAmount],
                    _handler: ENSO_HANDLER_ADDRESS,
                    _callData: encodedParameters,
                }, {
                    gasLimit: 2500000,
                });
                await tnx.wait();
                setSuccess(true);
                setNotification("Portfolio weights updated successfully!");
                
                
            }


            setSuccess(true);
            setNotification("Portfolio weights updated successfully!");
        } catch (err) {
            console.error("Error during weight update:", err);
            if (err.code === 4001) {
                setError("Transaction was rejected by user");
            } else if (err.code === -32002) {
                setError("Please check MetaMask for pending transaction");
            } else {
                setError(err.message || "An error occurred during weight update");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isMetaMaskInstalled) {
        return (
            <div className="update-weight">
                <h3>Update Portfolio Weights</h3>
                <div className="error">
                    MetaMask is not installed. Please install MetaMask to use this
                    feature.
                    <br />
                    <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download MetaMask
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="update-weight">
            <h3>Update Portfolio Weights</h3>

            {/* Portfolio Tokens Display */}
            <div className="portfolio-tokens-section">
                <h4>Portfolio Tokens</h4>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                    Portfolio Address: {portfolio?.portfolioAddress || 'Not provided'}
                    <br />
                    Tokens Count: {portfolioTokens.length}
                    <br />
                    Loading: {loadingTokens ? 'Yes' : 'No'}
                    <br />
                    <button
                        onClick={fetchPortfolioTokens}
                        disabled={loadingTokens}
                        style={{
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        {loadingTokens ? 'Loading...' : 'Refresh Tokens'}
                    </button>
                </div>
                {loadingTokens ? (
                    <div className="loading">Loading portfolio tokens...</div>
                ) : portfolioTokens.length > 0 ? (
                    <div className="tokens-list">
                        {portfolioTokens.map((token, index) => {
                            const details = tokenDetails[token];
                            return (
                                <div key={index} className="token-item">
                                    <div className="token-info">
                                        <div className="token-address">{token}</div>
                                        {details && details.isExternal && (
                                            <div className="underlying-tokens">
                                                <div className="token-label">External Position:</div>
                                                <div className="token0">Token0: {details.token0}</div>
                                                <div className="token1">Token1: {details.token1}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-tokens">No tokens found in portfolio</div>
                )}
            </div>

            <div className="weights-input">
                <div className="token-input-row">
                    <label>Token In (Sell Token):</label>
                    <input
                        type="text"
                        value={tokenIn}
                        onChange={(e) => setTokenIn(e.target.value)}
                        placeholder="Enter token address(es) separated by commas"
                        disabled={loading}
                    />
                </div>
                <div className="token-input-row">
                    <label>Token Out (Buy Token):</label>
                    <input
                        type="text"
                        value={tokenOut}
                        onChange={(e) => setTokenOut(e.target.value)}
                        placeholder="Enter token address(es) separated by commas"
                        disabled={loading}
                    />
                </div>
                <div className="token-input-row">
                    <label>Rebalance Percentage (%):</label>
                    <input
                        type="number"
                        value={rebalancePercentage}
                        onChange={(e) => setRebalancePercentage(e.target.value)}
                        placeholder="Enter percentage (1-100)"
                        min="1"
                        max="100"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <button
                    onClick={handleUpdateWeights}
                    disabled={loading}
                    className="update-button"
                >
                    {loading ? "Updating..." : "Update Tokens"}
                </button>
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">Tokens updated successfully!</div>}
            {notification && <div className="notification">{notification}</div>}
        </div>
    );
};

export default UpdateWeight; 