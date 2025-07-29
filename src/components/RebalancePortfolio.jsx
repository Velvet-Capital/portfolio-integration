import { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI, ASSET_MANAGEMENT_CONFIG_ABI, POSITION_MANAGER_ALGEBRA_ABI, REBALANCING_ABI, AMOUNT_CALCULATIONS_ALGEBRA_ABI, AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, POSITION_WRAPPER_ABI } from '../config/contracts';
import './RebalancePortfolio.css';
import { ENSO_HANDLER_ADDRESS } from '../config/contracts';
import { API_URL } from '../config/contracts';
import axios from 'axios';
import { BigNumber } from "ethers";
import qs from 'qs';
import { chainIdToAddresses } from '../config/networkVariables';

const addresses = chainIdToAddresses[56];

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// ERC20 ABI for balance checking
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)"
];

const RebalancePortfolio = ({ portfolio }) => {
    const { account, connect } = useMetaMask();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [notification, setNotification] = useState(null);
    const [tokenIn, setTokenIn] = useState('');
    const [tokenOut, setTokenOut] = useState('');

    const handleRebalance = async () => {
        if (!account) {
            await connect();
            return;
        }

        if (!tokenIn || !tokenOut) {
            setError('Please enter both token addresses');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);
        setNotification('Starting portfolio rebalance...');

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Get portfolio contract
            const portfolioContract = new ethers.Contract(
                portfolio.portfolioAddress,
                PORTFOLIO_ABI,
                signer
            );

            const config = await portfolioContract.assetManagementConfig();

            const assetManagementConfig = new ethers.Contract(
                config,
                ASSET_MANAGEMENT_CONFIG_ABI,
                provider
            );

            const oldtokens = await portfolioContract.getTokens();
            const positionManagerAddress = await assetManagementConfig.lastDeployedPositionManager();
            console.log("Raw position manager address:", positionManagerAddress);

            const positionManager = new ethers.Contract(
                positionManagerAddress,
                POSITION_MANAGER_ALGEBRA_ABI,
                signer
            );
            console.log("portfolio.positionIndex", portfolio.positionIndex);
            console.log(portfolio);
            console.log("portfolio.positionIndex", portfolio.positionIndex);
            const positionIndex = portfolio.positionList.length;
            const position = await positionManager.deployedPositionWrappers(0);
            console.log("position", position);

            const psoitionWrapper = new ethers.Contract(position, POSITION_WRAPPER_ABI, signer);

            const token0W = await psoitionWrapper.token0();
            const token1W = await psoitionWrapper.token1();
            console.log("token0W", token0W);
            console.log("token1W", token1W);

            let tokens = await portfolioContract.getTokens();
            console.log("tokens_______________________________", tokens);
            let sellToken = [tokenIn]; // wbnb
            let buyToken = position; // usdc
            let token0 = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8" // oldO
            let token1 = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
            let MIN_TICK = 12480
            let MAX_TICK = 16860

            // create the first position for WBNB and ETH  I also created Position1Wapper 

            // create a new position
            console.log("position", position);
            // try {
            //     const response = await fetch(`${API_URL}/positions/${position}`);
            //     if (!response.ok) {
            //         throw new Error('Failed to fetch position data');
            //     }
            //     const positionData = await response.json();
            //     console.log('Position data:', positionData);
            //     token0 = positionData.token1Address;
            //     token1 = positionData.token2Address;
            //     MIN_TICK = positionData.minTick;
            //     MAX_TICK = positionData.maxTick;
            //     console.log('token0', token0);
            //     console.log('token1', token1);
            //     console.log('MIN_TICK', MIN_TICK);
            //     console.log('MAX_TICK', MAX_TICK);
            // } catch (error) {
            //     console.error('Error fetching position data:', error);
            //     setError('Failed to fetch position data. Please try again.');
            //     setLoading(false);
            //     return;
            // }



            // position with WBNB and eth 
            // deposit wbnb
            // rebalance WBNB => USDC 

            // first create the position then balance 
            // new token would also have positionWrapper 
            // This is 

            // new position would only have one token 
            const finalTokens = oldtokens.filter(token => token !== tokenIn);
            let newTokens = [
                ...finalTokens,
                tokenOut
            ]
            let oldTokenSetup = [position, ...finalTokens]
            console.log("oldTokenSetup", oldTokenSetup);
            console.log("position", position);
            console.log("new Tokens:", newTokens);

            const ensoHandler = ENSO_HANDLER_ADDRESS;

            console.log("ensoHandler", ensoHandler);

            const swapTokens = [tokenIn, tokenOut];

            // Get the vault address
            setNotification('Getting vault address...');
            const vault = await portfolioContract.vault();

            // // Define new position token and sell token
            // newTokens = [position];
            // tokens = await portfolioContract.getTokens();
            // console.log('tokens', tokens);
            // sellToken = [tokens[0]]; // WBNB

            console.log('sellToken', sellToken);

            // Get current WBNB balance in vault
            setNotification('Getting current WBNB balance...');
            let sellTokenBalance = ethers.BigNumber.from(
                await new ethers.Contract(tokenIn, ERC20_ABI, signer).balanceOf(vault)
            ).toString();


            // let depositAmounts = await calculateDepositAmounts(
            //     tokenOut,// usdc 
            //     MIN_TICK,// new position
            //     MAX_TICK,// new position 
            //     sellTokenBalance  // wbnb balance 
            // );


            // Initialize arrays for protocol calls
            let callDataEnso = [[]];

            const postResponse0 = await createEnsoCallDataRoute(
                ensoHandler,
                ensoHandler,
                tokenIn,
                tokenOut,
                sellTokenBalance
            );
            callDataEnso[0].push(postResponse0.data.tx.data);

            // WBNB to usdc 
            // WBNB to eth 


            // let callDataIncreaseLiquidity = [[]];

            // Step 1: Create approval calldata
            setNotification('Preparing approval calldata...');
            let ABIApprove = ["function approve(address spender, uint256 amount)"];
            let abiEncodeApprove = new ethers.utils.Interface(ABIApprove);
            // callDataIncreaseLiquidity[0][0] = abiEncodeApprove.encodeFunctionData(
            //     "approve",
            //     [positionManagerAddress, postResponse0.data.amountOut]
            // );

            // Step 2: Create calldata for initializing and depositing
            setNotification('Preparing position initialization calldata...');
            let ABI = [
                "function initializePositionAndDeposit(address _dustReceiver, address _positionWrapper, (uint256 _amount0Desired, uint256 _amount1Desired, uint256 _amount0Min, uint256 _amount1Min, address _deployer) params)",
            ];
            let abiEncode = new ethers.utils.Interface(ABI);

            // callDataIncreaseLiquidity[0][1] = abiEncode.encodeFunctionData(
            //     "initializePositionAndDeposit",
            //     [
            //         account,
            //         newTokens[0],
            //         {
            //             _amount0Desired: 0,  // usdc here would be usdc balance 
            //             _amount1Desired: (Number(postResponse0.data.amountOut) * 0.999).toFixed(0),
            //             _amount0Min: 0,
            //             _amount1Min: 0,
            //             _deployer: ZERO_ADDRESS,
            //         },
            //     ]
            // );

            // only had WBNB in my profolio now I should have usdc and ETh 
            // divide wbnb in halfs and swap them for usdc and eth 

            // Encode all parameters
            setNotification('Encoding rebalancing parameters...');
            const encodedParameters = ethers.utils.defaultAbiCoder.encode(
                [
                    "bytes[][]",
                    "bytes[]",
                    "bytes[][]",
                    "address[][]",
                    "address[]",
                    "address[][]",
                    "address[][]",
                    "uint256[][]",
                ],
                [
                    callDataEnso,
                    [],
                    [[]],
                    [[]],
                    [],
                    [sellToken],
                    [[tokenOut]],
                    [[0]],
                ]
            );

            // Get rebalancing contract
            setNotification('Getting rebalancing contract...');
            const rebalancingAddress = portfolio.rebalancing;
            const rebalancing = new ethers.Contract(rebalancingAddress, REBALANCING_ABI, signer);

            // Execute rebalancing
            setNotification('Executing rebalancing operation...');
            const tx = await rebalancing.updateTokens({
                _newTokens: newTokens,
                _sellTokens: sellToken,
                _sellAmounts: [sellTokenBalance],
                _handler: ensoHandler,
                _callData: encodedParameters,
            }, { gasLimit: 1000000 });

            

            setNotification('Waiting for transaction to be mined...');
            await tx.wait();
            // const tx2 = await rebalancing.enableCollateralTokens([tokenOut], addresses.corePool_controller);

            // await tx2.wait();

            setNotification('Rebalancing completed successfully!');
            setSuccess(true);
        } catch (err) {
            console.error('Error during rebalancing:', err);
            setError(err.message || 'Failed to rebalance portfolio. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    async function calculateDepositAmounts(
        position,
        newTickLower,
        newTickUpper,
        inputAmount,
        Web3Provider
    ) {
        const amountCalculationsAlgebra = new ethers.Contract(AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS, AMOUNT_CALCULATIONS_ALGEBRA_ABI, Web3Provider);
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

    async function createEnsoCallDataRoute(
        ensoHandler,
        receiver,
        _tokenIn,
        _tokenOut,
        _amountIn
    ) {
        const params = {
            chainId: 56,
            fromAddress: ensoHandler,
            receiver: receiver,
            spender: ensoHandler,
            amountIn: _amountIn,
            slippage: 700,
            tokenIn: _tokenIn,
            tokenOut: _tokenOut,
            routingStrategy: "delegate",
        };

        console.log("params", params);

        const postUrl = "https://api.enso.finance/api/v1/shortcuts/route?";

        const headers = {
            //"Content-Type": "application/json",
            Authorization: import.meta.env.VITE_ENSO_KEY,
        };

        // console.log("URL", postUrl + `${qs.stringify(params)}`, {
        //   headers,
        // });

        return await axios.get(postUrl + `${qs.stringify(params)}`, {
            headers,
        });
    }


    return (
        <div className="rebalance-portfolio">
            <div className="input-group">
                <input
                    type="text"
                    value={tokenIn}
                    onChange={(e) => setTokenIn(e.target.value)}
                    placeholder="Enter token in address"
                    className="token-input"
                />
            </div>
            <div className="input-group">
                <input
                    type="text"
                    value={tokenOut}
                    onChange={(e) => setTokenOut(e.target.value)}
                    placeholder="Enter token out address"
                    className="token-input"
                />
            </div>
            <button
                onClick={handleRebalance}
                disabled={loading || !tokenIn || !tokenOut}
                className="rebalance-button"
            >
                {loading ? 'Rebalancing...' : 'Rebalance Portfolio'}
            </button>

            {notification && (
                <div className="notification">
                    <p>{notification}</p>
                </div>
            )}

            {error && (
                <div className="error">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            {success && (
                <div className="success">
                    <p>Portfolio rebalanced successfully!</p>
                </div>
            )}
        </div>
    );
};

export default RebalancePortfolio; 