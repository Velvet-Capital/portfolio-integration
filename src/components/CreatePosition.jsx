import React, { useState, useEffect } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import { 
    THENA_PROTOCOL_HASH,
    ZERO_ADDRESS,
    API_URL,
    PORTFOLIO_ABI,
    ASSET_MANAGEMENT_CONFIG_ABI,
    POSITION_MANAGER_ALGEBRA_ABI
} from '../config/contracts';
import './CreatePosition.css';

const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // BSC Mainnet
const ETH_ADDRESS = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"; // BSC 

const CreatePosition = ({ portfolioAddress, loadPortfolio }) => {
    const { account, connect, provider } = useMetaMask();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [notification, setNotification] = useState('');
    const [createdPosition, setCreatedPosition] = useState(null);
    const [positions, setPositions] = useState([]);
    const [formData, setFormData] = useState({
        token1: '',
        token2: '',
        minTick: '',
        maxTick: '',
        name: '',
        symbol: ''
    });

    // Fetch existing positions when component mounts
    useEffect(() => {
        if (portfolioAddress) {
            fetchPositions();
        }
    }, [portfolioAddress]);

    const fetchPositions = async () => {
        if (!portfolioAddress) return;
        
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const portfolioContract = new ethers.Contract(
                portfolioAddress,
                PORTFOLIO_ABI,
                signer
            );

            const assetManagementConfigAddress = await portfolioContract.assetManagementConfig();
            const assetManagementConfig = new ethers.Contract(
                assetManagementConfigAddress,
                ASSET_MANAGEMENT_CONFIG_ABI,
                signer
            );

            const positionManagerAddress = await assetManagementConfig.lastDeployedPositionManager();
            
            if (positionManagerAddress && positionManagerAddress !== ZERO_ADDRESS) {
                const positionManager = new ethers.Contract(
                    positionManagerAddress,
                    POSITION_MANAGER_ALGEBRA_ABI,
                    signer
                );

                const length = await getDeployedPositionWrappersLength(positionManager);
                const fetchedPositions = [];

                for (let i = 0; i < length; i++) {
                    try {
                        const positionAddress = await positionManager.deployedPositionWrappers(i);
                        if (positionAddress && positionAddress !== ZERO_ADDRESS) {
                            fetchedPositions.push({
                                index: i, // Convert BigNumber to number
                                address: positionAddress,
                                // You can add more position details here if needed
                            });
                        }
                    } catch (err) {
                        console.log(`Position at index ${i} not found`);
                        break;
                    }
                }

                setPositions(fetchedPositions);
                console.log("Fetched positions:", fetchedPositions);
            }
        } catch (err) {
            console.error("Error fetching positions:", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const createPosition = async () => {
        if (!account) {
            await connect();
            return;
        }

        setLoading(true);
        setError(null);
        setNotification('Creating position...');
        setCreatedPosition(null);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            console.log("portfolioAddress____________", portfolioAddress);

            const portfolioContract = new ethers.Contract(
                portfolioAddress,
                PORTFOLIO_ABI,
                signer
            );

            const assetManagementConfigAddress = await portfolioContract.assetManagementConfig();

            // Attach to AssetManagementConfig
            const assetManagementConfig = new ethers.Contract(
                assetManagementConfigAddress,
                ASSET_MANAGEMENT_CONFIG_ABI,
                signer
            );

            // Get position manager address
            const positionManagerAddress = await assetManagementConfig.lastDeployedPositionManager();
            console.log("Raw position manager address:", positionManagerAddress);

            if (!positionManagerAddress || positionManagerAddress === ZERO_ADDRESS) {
                throw new Error("Position manager address is zero or undefined");
            }

            // Attach to PositionManager
            const positionManager = new ethers.Contract(
                positionManagerAddress,
                POSITION_MANAGER_ALGEBRA_ABI,
                signer
            );
            console.log("PositionManager address:", positionManagerAddress);
            const lengthBefore = await getDeployedPositionWrappersLength(positionManager);
            console.log("Number of positions before creation:", lengthBefore);

            console.log("Creating new wrapper position...");
            console.log("positionManager", positionManager.address);
            const createTx = await positionManager.createNewWrapperPosition(
                formData.token1 || WBNB_ADDRESS,
                formData.token2 || ETH_ADDRESS,
                formData.name || "BNB/ETH Position",
                formData.symbol || "BNB/ETH",
                formData.minTick || "-144180",
                formData.maxTick || "122100"
            );

            console.log("Waiting for position creation transaction...");
            const receipt = await createTx.wait();
            console.log("Position creation transaction mined");

            // Fetch the newly created position
            const newPositionAddress = await positionManager.deployedPositionWrappers(lengthBefore);
            console.log("New position wrapper address:", newPositionAddress);

            if (newPositionAddress && newPositionAddress !== ZERO_ADDRESS) {
                const newPosition = {
                    index: Number(lengthBefore), // Convert BigNumber to number
                    address: newPositionAddress,
                    token1: formData.token1 || WBNB_ADDRESS,
                    token2: formData.token2 || ETH_ADDRESS,
                    name: formData.name || "BNB/ETH Position",
                    symbol: formData.symbol || "BNB/ETH",
                    minTick: formData.minTick || "-144180",
                    maxTick: formData.maxTick || "122100",
                    createdAt: new Date().toISOString(),
                    transactionHash: receipt.transactionHash
                };

                setCreatedPosition(newPosition);
                
                // Update the positions list
                setPositions(prev => [...prev, newPosition]);
                
                console.log("Newly created position:", newPosition);
            }

            setSuccess(true);
            setNotification('Position created successfully!');
            
            // Reset form
            setFormData({
                token1: '',
                token2: '',
                minTick: '',
                maxTick: '',
                name: '',
                symbol: ''
            });

            if (loadPortfolio) {
                console.log("Calling loadPortfolio after initialization");
                await loadPortfolio();
            }
        } catch (err) {
            console.error("Error creating position:", err);
            setError(err.message || 'Failed to create position. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    async function getDeployedPositionWrappersLength(positionManager) {
        let length = 0;
        while (true) {
            try {
                await positionManager.deployedPositionWrappers(length);
                length++;
            } catch (e) {
                break;
            }
        }
        return length;
    }

    return (
        <div className="create-position">
            <h3>Create Position</h3>
            
            {/* Display existing positions */}
            {positions.length > 0 && (
                <div className="existing-positions">
                    <h4>Existing Positions ({positions.length})</h4>
                    <div className="positions-list">
                        {positions.map((position, index) => (
                            <div key={index} className="position-item">
                                <p><strong>Position {position.index}:</strong> {position.address}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Display newly created position */}
            {createdPosition && (
                <div className="newly-created-position">
                    <h4>✅ Newly Created Position</h4>
                    <div className="position-item highlighted">
                        <p><strong>Position {createdPosition.index}:</strong> {createdPosition.address}</p>
                    </div>
                </div>
            )}

            {/* Create Position Form */}
            <div className="create-position-form">
                <h4>Create New Position</h4>
                <div className="form-group">
                    <label>Token 1 Address:</label>
                    <input
                        type="text"
                        name="token1"
                        value={formData.token1}
                        onChange={handleInputChange}
                        placeholder="Enter Token 1 address (defaults to WBNB)"
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Token 2 Address:</label>
                    <input
                        type="text"
                        name="token2"
                        value={formData.token2}
                        onChange={handleInputChange}
                        placeholder="Enter Token 2 address (defaults to ETH)"
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Position Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter position name (defaults to BNB/ETH Position)"
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Position Symbol:</label>
                    <input
                        type="text"
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleInputChange}
                        placeholder="Enter position symbol (defaults to BNB/ETH)"
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Min Tick:</label>
                    <input
                        type="number"
                        name="minTick"
                        value={formData.minTick}
                        onChange={handleInputChange}
                        placeholder="Enter minimum tick (defaults to -144180)"
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Max Tick:</label>
                    <input
                        type="number"
                        name="maxTick"
                        value={formData.maxTick}
                        onChange={handleInputChange}
                        placeholder="Enter maximum tick (defaults to -122100)"
                        disabled={loading}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                {notification && <div className="notification">{notification}</div>}
                {!account ? (
                    <button onClick={connect} className="connect-button">
                        Connect Wallet
                    </button>
                ) : (
                    <button 
                        onClick={createPosition}
                        disabled={loading}
                        className="create-position-button"
                    >
                        {loading ? 'Creating Position...' : 'Create Position'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CreatePosition; 