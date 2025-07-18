import React, { useState } from 'react';
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
    const [formData, setFormData] = useState({
        token1: '',
        token2: '',
        minTick: '',
        maxTick: '',
        name: '',
        symbol: ''
    });

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

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Get portfolio info from the database
            const response = await fetch(`${API_URL}/portfolios/${portfolioAddress}`);
            if (!response.ok) {
                throw new Error('Failed to fetch portfolio info');
            }
            const portfolioInfo = await response.json();
            console.log("Portfolio info:", portfolioInfo);

            // Attach to AssetManagementConfig
            const assetManagementConfig = new ethers.Contract(
                portfolioInfo.assetManagementConfig,
                ASSET_MANAGEMENT_CONFIG_ABI,
                signer
            );
            console.log("AssetManagementConfig address:", portfolioInfo.assetManagementConfig);

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
                formData.maxTick || "-122100"
            );

            console.log("Waiting for position creation transaction...");
            await createTx.wait();
            console.log("Position creation transaction mined");

            const position1 = await positionManager.deployedPositionWrappers(lengthBefore);
            console.log("New position wrapper address:", position1);

            if (!position1 || position1 === ZERO_ADDRESS) {
                throw new Error("Position wrapper address is zero or undefined");
            }

            // Update portfolio position list
            const updateFields = {
                positionList: portfolioInfo.positionList ? [...portfolioInfo.positionList, position1] : [position1],
                positionIndex: portfolioInfo.positionIndex ? portfolioInfo.positionIndex + 1 : 0
            };
            const updateResponse = await fetch(`${API_URL}/portfolios/${portfolioAddress}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updateFields })
            });
            if (!updateResponse.ok) {
                throw new Error('Failed to update portfolio info');
            }


            const positionData = {
                token1Address: formData.token1,
                token2Address: formData.token2,
                positionAddress: position1,
                minTick: formData.minTick,
                maxTick: formData.maxTick,
                createdAt: new Date()
              };

              console.log("positionData", positionData);


            const savePositionResponse = await fetch(`${API_URL}/positions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(positionData)
            });
            console.log("savePositionResponse", savePositionResponse);
            if (!savePositionResponse.ok) {
                throw new Error('Failed to update portfolio info');
            }
            console.log("Initializing portfolio tokens with WBNB...");
            // Attach to Portfolio contract
            const portfolio = new ethers.Contract(
                portfolioAddress,
                PORTFOLIO_ABI,
                signer
            );
            const initTokenTx = await portfolio.initToken([formData.token1], {
                gasLimit: 1000000
            });
            await initTokenTx.wait();
            console.log("Portfolio tokens initialized.");

            setSuccess(true);
            setNotification('Position created successfully!');
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
    );
};

export default CreatePosition; 