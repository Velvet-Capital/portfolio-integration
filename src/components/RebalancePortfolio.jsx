import { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { PORTFOLIO_ABI, ASSET_MANAGEMENT_CONFIG_ABI, POSITION_MANAGER_ALGEBRA_ABI, REBALANCING_ABI } from '../config/contracts';
import './RebalancePortfolio.css';
import { ENSO_HANDLER_ADDRESS } from '../config/contracts';
import { API_URL } from '../config/contracts';

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

    const handleRebalance = async () => {
        if (!account) {
            await connect();
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);
        setNotification('Starting rebalancing process...');

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Get portfolio contract
            const portfolioContract = new ethers.Contract(
                portfolio.portfolioAddress,
                PORTFOLIO_ABI,
                signer
            );

            const assetManagementConfig = new ethers.Contract(
                portfolio.assetManagementConfig,
                ASSET_MANAGEMENT_CONFIG_ABI,
                signer
            );
            const positionManagerAddress = await assetManagementConfig.lastDeployedPositionManager();
            console.log("Raw position manager address:", positionManagerAddress);

            const positionManager = new ethers.Contract(
                positionManagerAddress,
                POSITION_MANAGER_ALGEBRA_ABI,
                signer
            );
            console.log("portfolio.positionIndex", portfolio.positionIndex);
            console.log(portfolio);
            const position1 = await positionManager.deployedPositionWrappers(portfolio.positionIndex);
            console.log("position1", position1);

            const ensoHandler = ENSO_HANDLER_ADDRESS;

            // Get the vault address
            setNotification('Getting vault address...');
            const vault = await portfolioContract.vault();

            // Define new position token and sell token
            const newTokens = [position1];
            const tokens = await portfolioContract.getTokens();
            console.log('tokens', tokens);
            const sellToken = [tokens[0]]; // WBNB

            console.log('sellToken', sellToken);

            // Get current WBNB balance in vault
            setNotification('Getting current WBNB balance...');
            const sellTokenBalance = ethers.BigNumber.from(
                await new ethers.Contract(tokens[0], ERC20_ABI, signer).balanceOf(vault)
            ).toString();

            // Initialize arrays for protocol calls
            let callDataEnso = [[]];
            let callDataIncreaseLiquidity = [[]];

            // Step 1: Create approval calldata
            setNotification('Preparing approval calldata...');
            let ABIApprove = ["function approve(address spender, uint256 amount)"];
            let abiEncodeApprove = new ethers.utils.Interface(ABIApprove);
            callDataIncreaseLiquidity[0][0] = abiEncodeApprove.encodeFunctionData(
                "approve",
                [positionManagerAddress, sellTokenBalance]
            );

            // Step 2: Create calldata for initializing and depositing
            setNotification('Preparing position initialization calldata...');
            let ABI = [
                "function initializePositionAndDeposit(address _dustReceiver, address _positionWrapper, (uint256 _amount0Desired, uint256 _amount1Desired, uint256 _amount0Min, uint256 _amount1Min, address _deployer) params)",
            ];
            let abiEncode = new ethers.utils.Interface(ABI);

            callDataIncreaseLiquidity[0][1] = abiEncode.encodeFunctionData(
                "initializePositionAndDeposit",
                [
                    account,
                    newTokens[0],
                    {
                        _amount0Desired: 0,
                        _amount1Desired: sellTokenBalance,
                        _amount0Min: 0,
                        _amount1Min: 0,
                        _deployer: ZERO_ADDRESS,
                    },
                ]
            );

            // Encode all parameters
            setNotification('Encoding rebalancing parameters...');
            const encodedParameters = ethers.utils.defaultAbiCoder.encode(
                [
                    "bytes[][]",
                    "bytes[]",
                    "bytes[][]",
                    "address[][]",
                    "address[]",
                    "address[]",
                    "address[][]",
                    "uint256[][]",
                ],
                [
                    callDataEnso,
                    [],
                    callDataIncreaseLiquidity,
                    [[tokens[0], positionManagerAddress]],
                    [],
                    sellToken,
                    [[position1]],
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
            });

            setNotification('Waiting for transaction to be mined...');
            await tx.wait();

            setNotification('Rebalancing completed successfully!');
            setSuccess(true);
        } catch (err) {
            console.error('Error during rebalancing:', err);
            setError(err.message || 'Failed to rebalance portfolio. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rebalance-portfolio">
            <button
                onClick={handleRebalance}
                disabled={loading}
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