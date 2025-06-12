import React, { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import {
    THENA_PROTOCOL_HASH,
    ZERO_ADDRESS,
    API_URL,
    PORTFOLIO_ABI,
    ASSET_MANAGEMENT_CONFIG_ABI,
    POSITION_MANAGER_ALGEBRA_ABI,
} from '../config/contracts';

const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // BSC Mainnet
const ETH_ADDRESS = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"; // BSC 

const CreatePosition = ({ portfolioAddress, loadPortfolio }) => {
    const { account, connect, provider } = useMetaMask();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createPosition = async () => {
        if (!account) {
            await connect();
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

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
                WBNB_ADDRESS,
                ETH_ADDRESS,
                "BNB/ETH Position",
                "BNB/ETH",
                "-144180",
                "-122100"
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

            console.log("Initializing portfolio tokens with WBNB...");
            // Attach to Portfolio contract
            const portfolio = new ethers.Contract(
                portfolioAddress,
                PORTFOLIO_ABI,
                signer
            );
            const initTokenTx = await portfolio.initToken([WBNB_ADDRESS], {
                gasLimit: 1000000
            });
            await initTokenTx.wait();
            console.log("Portfolio tokens initialized.");

            setSuccess(true);
            if (loadPortfolio) {
                console.log("Calling loadPortfolio after initialization");
                await loadPortfolio();
            }
        } catch (err) {
            console.error("Error creating position:", err);
            setError(err.message);
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

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (success) {
        return <div className="success-message">Successfully created WBNB/ETH position!</div>;
    }

    return (
        <div className="create-position" style={{ padding: '10px', marginTop: '10px' }}>
            <h3>Create WBNB/ETH Position</h3>
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
                    {loading ? 'Creating Position...' : 'Create WBNB/ETH Position'}
                </button>
            )}
        </div>
    );
};

export default CreatePosition; 