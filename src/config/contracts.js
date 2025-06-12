import { ethers } from "ethers";
// Contract Addresses
export const PORTFOLIO_FACTORY_ADDRESS = import.meta.env.VITE_PORTFOLIO_FACTORY_ADDRESS;
export const TREASURY_ADDRESS = import.meta.env.VITE_TREASURY_ADDRESS;

// Protocol Configuration
export const THENA_PROTOCOL_HASH = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("THENA-CONCENTRATED-LIQUIDITY")
  );

// Network Configuration
export const NETWORK_ID = import.meta.env.VITE_NETWORK_ID || "1";
export const RPC_URL = import.meta.env.VITE_RPC_URL;

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Default Fee Configuration
export const DEFAULT_FEES = {
  managementFee: 2, // 2%
  performanceFee: 20, // 20%
  entryFee: 1, // 1%
  exitFee: 1 // 1%
};

// Default Portfolio Configuration
export const DEFAULT_PORTFOLIO = {
  initialAmount: 0.1, // 0.1 ETH
  minHolding: 0.01 // 0.01 ETH
};

// Constants
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// Contract ABI
export const PORTFOLIO_FACTORY_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "CallerNotSuperAdmin",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidThresholdLength",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ModuleNotInitialised",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoOwnerPassed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PortfolioCreationIsPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ProtocolIsPaused",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ProtocolNotPaused",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "previousAdmin",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newAdmin",
          "type": "address"
        }
      ],
      "name": "AdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "beacon",
          "type": "address"
        }
      ],
      "name": "BeaconUpgraded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "version",
          "type": "uint8"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferStarted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bool",
          "name": "state",
          "type": "bool"
        }
      ],
      "name": "PortfolioCreationState",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "portfolio",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "tokenExclusionManager",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "rebalancing",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "borrowManager",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "assetManagementConfig",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "feeModule",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "vaultAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "gnosisModule",
              "type": "address"
            }
          ],
          "indexed": false,
          "internalType": "struct PortfolioFactory.PortfoliolInfo",
          "name": "portfolioData",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "portfolioId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_accessController",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isPublicPortfolio",
          "type": "bool"
        }
      ],
      "name": "PortfolioInfo",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "TransferSuperAdminOwnership",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newGnosisSingleton",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newGnosisFallbackLibrary",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newGnosisMultisendLibrary",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newGnosisSafeProxyFactory",
          "type": "address"
        }
      ],
      "name": "UpdateGnosisAddresses",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "UpgradeAssetManagerConfig",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "UpgradeBorrowManager",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "UpgradeFeeModule",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "UpgradePortfolio",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "UpgradePositionManager",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "UpgradeRebalance",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "UpgradeTokenExclusionManager",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "UpgradeTokenRemovalVaultBaseAddress",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "implementation",
          "type": "address"
        }
      ],
      "name": "Upgraded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "PortfolioInfolList",
      "outputs": [
        {
          "internalType": "address",
          "name": "portfolio",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenExclusionManager",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "rebalancing",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "borrowManager",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "assetManagementConfig",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "feeModule",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "vaultAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "gnosisModule",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "acceptOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "_assetManagerTreasury",
              "type": "address"
            },
            {
              "internalType": "address[]",
              "name": "_whitelistedTokens",
              "type": "address[]"
            },
            {
              "internalType": "uint256",
              "name": "_managementFee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_performanceFee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_entryFee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_exitFee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_initialPortfolioAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_minPortfolioTokenHoldingAmount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "_public",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "_transferable",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "_transferableToPublic",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "_whitelistTokens",
              "type": "bool"
            },
            {
              "internalType": "bytes32[]",
              "name": "_witelistedProtocolIds",
              "type": "bytes32[]"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_symbol",
              "type": "string"
            }
          ],
          "internalType": "struct FunctionParameters.PortfolioCreationInitData",
          "name": "initData",
          "type": "tuple"
        },
        {
          "internalType": "address[]",
          "name": "_owners",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "_threshold",
          "type": "uint256"
        }
      ],
      "name": "createPortfolioCustodial",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "_assetManagerTreasury",
              "type": "address"
            },
            {
              "internalType": "address[]",
              "name": "_whitelistedTokens",
              "type": "address[]"
            },
            {
              "internalType": "uint256",
              "name": "_managementFee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_performanceFee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_entryFee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_exitFee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_initialPortfolioAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_minPortfolioTokenHoldingAmount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "_public",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "_transferable",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "_transferableToPublic",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "_whitelistTokens",
              "type": "bool"
            },
            {
              "internalType": "bytes32[]",
              "name": "_witelistedProtocolIds",
              "type": "bytes32[]"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_symbol",
              "type": "string"
            }
          ],
          "internalType": "struct FunctionParameters.PortfolioCreationInitData",
          "name": "initData",
          "type": "tuple"
        }
      ],
      "name": "createPortfolioNonCustodial",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "portfoliofundId",
          "type": "uint256"
        }
      ],
      "name": "getPortfolioList",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gnosisFallbackLibrary",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gnosisMultisendLibrary",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gnosisSafeProxyFactory",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gnosisSingleton",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "_basePortfolioAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_baseTokenExclusionManagerAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_baseRebalancingAddres",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_baseAssetManagementConfigAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_feeModuleImplementationAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_baseTokenRemovalVaultImplementation",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_baseVelvetGnosisSafeModuleAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_basePositionManager",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_baseExternalPositionStorage",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_baseBorrowManager",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_gnosisSingleton",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_gnosisFallbackLibrary",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_gnosisMultisendLibrary",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_gnosisSafeProxyFactory",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_protocolConfig",
              "type": "address"
            }
          ],
          "internalType": "struct FunctionParameters.PortfolioFactoryInitData",
          "name": "initData",
          "type": "tuple"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pendingOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "portfolioId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolConfig",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proxiableUUID",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_state",
          "type": "bool"
        }
      ],
      "name": "setPortfolioCreationState",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newImpl",
          "type": "address"
        }
      ],
      "name": "setTokenRemovalVaultModule",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_accessController",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        }
      ],
      "name": "transferSuperAdminOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newBaseAddress",
          "type": "address"
        }
      ],
      "name": "updateBaseExternalPositionStorageAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newGnosisSingleton",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_newGnosisFallbackLibrary",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_newGnosisMultisendLibrary",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_newGnosisSafeProxyFactory",
          "type": "address"
        }
      ],
      "name": "updateGnosisAddresses",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_proxy",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_newImpl",
          "type": "address"
        }
      ],
      "name": "upgradeAssetManagerConfig",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_proxy",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_newImpl",
          "type": "address"
        }
      ],
      "name": "upgradeBorrowManager",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_proxy",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_newImpl",
          "type": "address"
        }
      ],
      "name": "upgradeFeeModule",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_proxy",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_newImpl",
          "type": "address"
        }
      ],
      "name": "upgradePortfolio",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_proxy",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_newImpl",
          "type": "address"
        }
      ],
      "name": "upgradePositionManager",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_proxy",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_newImpl",
          "type": "address"
        }
      ],
      "name": "upgradeRebalance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "upgradeTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "upgradeToAndCall",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_proxy",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_newImpl",
          "type": "address"
        }
      ],
      "name": "upgradeTokenExclusionManager",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "whitelistedPortfolioAddress",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

// Contract ABIs
export const PORTFOLIO_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "AlreadyInitialized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AmountCannotBeZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "BalanceOfVaultIsZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CallerNeedToMaintainMinTokenAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CallerNotHavingGivenPortfolioTokenAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CallerNotPortfolioManager",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CallerNotRebalancerContract",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CallerNotSuperAdmin",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CoolDownPeriodNotPassed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DivisionByZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidCastToUint160",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidDepositInputLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidExemptionTokens",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidExemptionTokensLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidMintAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidTokenAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "MintedAmountIsNotAccepted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PortfolioTokenNotInitialized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProtocolIsPaused",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TokenAlreadyExist",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "TokenCountOutOfLimit",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TokenNotEnabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TokenNotWhitelisted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransferFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Transferprohibited",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UserNotAllowedToDeposit",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "VaultInteractionCallFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "WithdrawalAmountIsSmall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
      }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "portfolio",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "mintedAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "userBalanceAfterDeposit",
        "type": "uint256"
      }
    ],
    "name": "Deposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "portfolio",
        "type": "address"
      }
    ],
    "name": "PublicSwapEnabled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "depositedAmounts",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "portfolioTokens",
        "type": "address[]"
      }
    ],
    "name": "UserDepositedAmounts",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "burnedAmount",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "portfolio",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "portfolioTokens",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "userBalanceAfterWithdrawal",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "userWithdrawalAmounts",
        "type": "uint256[]"
      }
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "_lastDepositTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "_lastWithdrawCooldown",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "accessController",
    "outputs": [
      {
        "internalType": "contract IAccessController",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "assetManagementConfig",
    "outputs": [
      {
        "internalType": "contract IAssetManagementConfig",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioTokenAmount",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "_exemptionTokens",
        "type": "address[]"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "_factory",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token0",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token1",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_flashLoanToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_solverHandler",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_swapHandler",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_bufferUnit",
            "type": "uint256"
          },
          {
            "internalType": "uint256[][]",
            "name": "_flashLoanAmount",
            "type": "uint256[][]"
          },
          {
            "internalType": "uint256[][]",
            "name": "_poolFees",
            "type": "uint256[][]"
          },
          {
            "internalType": "bytes[][]",
            "name": "firstSwapData",
            "type": "bytes[][]"
          },
          {
            "internalType": "bytes[][]",
            "name": "secondSwapData",
            "type": "bytes[][]"
          },
          {
            "internalType": "bool",
            "name": "isDexRepayment",
            "type": "bool"
          }
        ],
        "internalType": "struct FunctionParameters.withdrawRepayParams",
        "name": "repayData",
        "type": "tuple"
      }
    ],
    "name": "emergencyWithdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_withdrawFor",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenReceiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_portfolioTokenAmount",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "_exemptionTokens",
        "type": "address[]"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "_factory",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token0",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token1",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_flashLoanToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_solverHandler",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_swapHandler",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_bufferUnit",
            "type": "uint256"
          },
          {
            "internalType": "uint256[][]",
            "name": "_flashLoanAmount",
            "type": "uint256[][]"
          },
          {
            "internalType": "uint256[][]",
            "name": "_poolFees",
            "type": "uint256[][]"
          },
          {
            "internalType": "bytes[][]",
            "name": "firstSwapData",
            "type": "bytes[][]"
          },
          {
            "internalType": "bytes[][]",
            "name": "secondSwapData",
            "type": "bytes[][]"
          },
          {
            "internalType": "bool",
            "name": "isDexRepayment",
            "type": "bool"
          }
        ],
        "internalType": "struct FunctionParameters.withdrawRepayParams",
        "name": "repayData",
        "type": "tuple"
      }
    ],
    "name": "emergencyWithdrawalFor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeModule",
    "outputs": [
      {
        "internalType": "contract IFeeModule",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokens",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IPriceOracle",
        "name": "_oracle",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "_tokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "_totalSupply",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      }
    ],
    "name": "getVaultValueInUSD",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "vaultValue",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_symbol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "_vault",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_module",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_tokenExclusionManager",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_borrowManager",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_accessController",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_protocolConfig",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_assetManagementConfig",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_feeModule",
            "type": "address"
          }
        ],
        "internalType": "struct FunctionParameters.PortfolioInitData",
        "name": "initData",
        "type": "tuple"
      }
    ],
    "name": "init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_tokens",
        "type": "address[]"
      }
    ],
    "name": "initToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "mintShares",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "depositAmounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "_minMintAmount",
        "type": "uint256"
      },
      {
        "components": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "internalType": "uint160",
                "name": "amount",
                "type": "uint160"
              },
              {
                "internalType": "uint48",
                "name": "expiration",
                "type": "uint48"
              },
              {
                "internalType": "uint48",
                "name": "nonce",
                "type": "uint48"
              }
            ],
            "internalType": "struct IAllowanceTransfer.PermitDetails[]",
            "name": "details",
            "type": "tuple[]"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "sigDeadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct IAllowanceTransfer.PermitBatch",
        "name": "_permit",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "multiTokenDeposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_depositFor",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "depositAmounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "_minMintAmount",
        "type": "uint256"
      }
    ],
    "name": "multiTokenDepositFor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioTokenAmount",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "_factory",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token0",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token1",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_flashLoanToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_solverHandler",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_swapHandler",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_bufferUnit",
            "type": "uint256"
          },
          {
            "internalType": "uint256[][]",
            "name": "_flashLoanAmount",
            "type": "uint256[][]"
          },
          {
            "internalType": "uint256[][]",
            "name": "_poolFees",
            "type": "uint256[][]"
          },
          {
            "internalType": "bytes[][]",
            "name": "firstSwapData",
            "type": "bytes[][]"
          },
          {
            "internalType": "bytes[][]",
            "name": "secondSwapData",
            "type": "bytes[][]"
          },
          {
            "internalType": "bool",
            "name": "isDexRepayment",
            "type": "bool"
          }
        ],
        "internalType": "struct FunctionParameters.withdrawRepayParams",
        "name": "repayData",
        "type": "tuple"
      }
    ],
    "name": "multiTokenWithdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_withdrawFor",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenReceiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_portfolioTokenAmount",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "_factory",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token0",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token1",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_flashLoanToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_solverHandler",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_swapHandler",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_bufferUnit",
            "type": "uint256"
          },
          {
            "internalType": "uint256[][]",
            "name": "_flashLoanAmount",
            "type": "uint256[][]"
          },
          {
            "internalType": "uint256[][]",
            "name": "_poolFees",
            "type": "uint256[][]"
          },
          {
            "internalType": "bytes[][]",
            "name": "firstSwapData",
            "type": "bytes[][]"
          },
          {
            "internalType": "bytes[][]",
            "name": "secondSwapData",
            "type": "bytes[][]"
          },
          {
            "internalType": "bool",
            "name": "isDexRepayment",
            "type": "bool"
          }
        ],
        "internalType": "struct FunctionParameters.withdrawRepayParams",
        "name": "repayData",
        "type": "tuple"
      }
    ],
    "name": "multiTokenWithdrawalFor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "permit2",
    "outputs": [
      {
        "internalType": "contract IAllowanceTransfer",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolConfig",
    "outputs": [
      {
        "internalType": "contract IProtocolConfig",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "pullFromVault",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "safeModule",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenExclusionManager",
    "outputs": [
      {
        "internalType": "contract ITokenExclusionManager",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_tokens",
        "type": "address[]"
      }
    ],
    "name": "updateTokenList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "upgradeTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userCooldownPeriod",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userLastDepositTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vault",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_target",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_claimCalldata",
        "type": "bytes"
      }
    ],
    "name": "vaultInteraction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const ASSET_MANAGEMENT_CONFIG_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "CallerNotAssetManager",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CallerNotWhitelistManager",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidFee",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidInitialPortfolioAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidMinAmountByAssetManager",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidMinPortfolioAmountByAssetManager",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidMinPortfolioTokenHoldingAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidTokenWhitelistLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidWhitelistLimit",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoNewFeeSet",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "ProtocolManagerAlreadyEnabled",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "ProtocolNotEnabled",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "ProtocolNotWhitelisted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PublicFundToWhitelistedNotAllowed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TimePeriodNotOver",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UniSwapV3WrapperAlreadyEnabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZeroAddressTreasury",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
      }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bool",
        "name": "isPublic",
        "type": "bool"
      },
      {
        "indexed": true,
        "internalType": "bool",
        "name": "isTransferableToPublic",
        "type": "bool"
      }
    ],
    "name": "ChangedPortfolioToPublic",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "DeleteProposedEntryAndExitFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "DeleteProposedManagementFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "DeleteProposedPerformanceFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_newInitialPortfolioAmount",
        "type": "uint256"
      }
    ],
    "name": "InitialPortfolioAmountUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_minPortfolioTokenHoldingAmount",
        "type": "uint256"
      }
    ],
    "name": "MinPortfolioTokenHoldingAmountUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "newEntryFee",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "newExitFee",
        "type": "uint256"
      }
    ],
    "name": "ProposeEntryAndExitFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "newManagementFee",
        "type": "uint256"
      }
    ],
    "name": "ProposeManagementFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "newPerformanceFee",
        "type": "uint256"
      }
    ],
    "name": "ProposePerformanceFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "protocolId",
        "type": "bytes32"
      }
    ],
    "name": "ProtocolManagerEnabled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      }
    ],
    "name": "TokenWhitelisted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      }
    ],
    "name": "TokensRemovedFromWhitelist",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bool",
        "name": "_transferable",
        "type": "bool"
      },
      {
        "indexed": true,
        "internalType": "bool",
        "name": "_publicTransfers",
        "type": "bool"
      }
    ],
    "name": "TransferabilityUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "newTreasury",
        "type": "address"
      }
    ],
    "name": "TreasuryUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "UniswapV3ManagerEnabled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "newEntryFee",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "newExitFee",
        "type": "uint256"
      }
    ],
    "name": "UpdateEntryAndExitFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "newManagementFee",
        "type": "uint256"
      }
    ],
    "name": "UpdateManagementFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "newPerformanceFee",
        "type": "uint256"
      }
    ],
    "name": "UpdatePerformanceFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "users",
        "type": "address[]"
      }
    ],
    "name": "UserRemovedFromWhitelist",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "users",
        "type": "address[]"
      }
    ],
    "name": "UserWhitelisted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "assetManagerTreasury",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "convertPrivateFundToPublic",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deleteProposedEntryAndExitFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deleteProposedManagementFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deleteProposedPerformanceFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "protocolId",
        "type": "bytes32"
      }
    ],
    "name": "enableUniSwapV3Manager",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "entryFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exitFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "externalPositions",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_managementFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_performanceFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_entryFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_exitFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_initialPortfolioAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_minPortfolioTokenHoldingAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_protocolConfig",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_accessController",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_feeModule",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_assetManagerTreasury",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_basePositionManager",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_baseExternalPositionStorage",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "_whitelistedTokens",
            "type": "address[]"
          },
          {
            "internalType": "bool",
            "name": "_publicPortfolio",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "_transferable",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "_transferableToPublic",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "_whitelistTokens",
            "type": "bool"
          },
          {
            "internalType": "bytes32[]",
            "name": "_witelistedProtocolIds",
            "type": "bytes32[]"
          }
        ],
        "internalType": "struct FunctionParameters.AssetManagementConfigInitData",
        "name": "initData",
        "type": "tuple"
      }
    ],
    "name": "init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialPortfolioAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "name": "isTokenWhitelisted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastDeployedPositionManager",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "managementFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minPortfolioTokenHoldingAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "newEntryFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "newExitFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "newManagementFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "newPerformanceFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "performanceFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "positionManagerEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "positionManagers",
    "outputs": [
      {
        "internalType": "contract IPositionManager",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newEntryFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_newExitFee",
        "type": "uint256"
      }
    ],
    "name": "proposeNewEntryAndExitFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newManagementFee",
        "type": "uint256"
      }
    ],
    "name": "proposeNewManagementFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newPerformanceFee",
        "type": "uint256"
      }
    ],
    "name": "proposeNewPerformanceFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proposedEntryAndExitFeeTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proposedManagementFeeTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proposedPerformanceFeeTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolConfig",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "publicPortfolio",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "users",
        "type": "address[]"
      }
    ],
    "name": "removeWhitelistedUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenWhitelistingEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "transferable",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "transferableToPublic",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "uniswapV3WrapperEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newAssetManagerTreasury",
        "type": "address"
      }
    ],
    "name": "updateAssetManagerTreasury",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "updateEntryAndExitFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newAmount",
        "type": "uint256"
      }
    ],
    "name": "updateInitialPortfolioAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "updateManagementFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_minPortfolioTokenHoldingAmount",
        "type": "uint256"
      }
    ],
    "name": "updateMinPortfolioTokenHoldingAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "updatePerformanceFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_transferable",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "_publicTransfer",
        "type": "bool"
      }
    ],
    "name": "updateTransferability",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "upgradeTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "users",
        "type": "address[]"
      }
    ],
    "name": "whitelistUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "whitelistedProtocols",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "whitelistedTokens",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "whitelistedUsers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const POSITION_MANAGER_ALGEBRA_ABI = [
  {
    "inputs": [],
    "name": "AmountCannotBeZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CallerNotAdmin",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CallerNotAssetManager",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DivisionByZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidCastToUint128",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidPositionWrapper",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidTokenAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProtocolEmergencyPaused",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProtocolIsPaused",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TokenNotEnabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TokenNotWhitelisted",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
      }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      }
    ],
    "name": "LiquidityDecreased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      }
    ],
    "name": "LiquidityIncreased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "positionWrapper",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token0",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token1",
        "type": "address"
      }
    ],
    "name": "NewPositionCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "positionManager",
        "type": "address"
      }
    ],
    "name": "PositionInitializedAndDeposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "positionManager",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "int24",
        "name": "tickLower",
        "type": "int24"
      },
      {
        "indexed": false,
        "internalType": "int24",
        "name": "tickUpper",
        "type": "int24"
      }
    ],
    "name": "PriceRangeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token0",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_token1",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_symbol",
        "type": "string"
      },
      {
        "internalType": "int24",
        "name": "_tickLower",
        "type": "int24"
      },
      {
        "internalType": "int24",
        "name": "_tickUpper",
        "type": "int24"
      }
    ],
    "name": "createNewWrapperPosition",
    "outputs": [
      {
        "internalType": "contract IPositionWrapper",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_dustReceiver",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_token0",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_token1",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_symbol",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_amount0Desired",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount1Desired",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount0Min",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount1Min",
            "type": "uint256"
          },
          {
            "internalType": "int24",
            "name": "_tickLower",
            "type": "int24"
          },
          {
            "internalType": "int24",
            "name": "_tickUpper",
            "type": "int24"
          },
          {
            "internalType": "address",
            "name": "_deployer",
            "type": "address"
          }
        ],
        "internalType": "struct WrapperFunctionParameters.PositionMintParamsThena",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "createNewWrapperPositionAndDeposit",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IPositionWrapper",
        "name": "_positionWrapper",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_withdrawalAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amount0Min",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amount1Min",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_swapDeployer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint24",
        "name": "_fee",
        "type": "uint24"
      }
    ],
    "name": "decreaseLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "deployedPositionWrappers",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "externalPositionStorage",
    "outputs": [
      {
        "internalType": "contract IExternalPositionStorage",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "_dustReceiver",
            "type": "address"
          },
          {
            "internalType": "contract IPositionWrapper",
            "name": "_positionWrapper",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount0Desired",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount1Desired",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount0Min",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount1Min",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_swapDeployer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_tokenOut",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint24",
            "name": "_fee",
            "type": "uint24"
          }
        ],
        "internalType": "struct WrapperFunctionParameters.WrapperDepositParams",
        "name": "_params",
        "type": "tuple"
      }
    ],
    "name": "increaseLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_externalPositionStorage",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_protocolConfig",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_assetManagerConfig",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_accessController",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_nftManager",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_swapRouter",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_protocolId",
        "type": "bytes32"
      }
    ],
    "name": "init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_dustReceiver",
        "type": "address"
      },
      {
        "internalType": "contract IPositionWrapper",
        "name": "_positionWrapper",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_amount0Desired",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount1Desired",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount0Min",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount1Min",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_deployer",
            "type": "address"
          }
        ],
        "internalType": "struct WrapperFunctionParameters.InitialMintParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "initializePositionAndDeposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolConfig",
    "outputs": [
      {
        "internalType": "contract IProtocolConfig",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "contract IPositionWrapper",
            "name": "_positionWrapper",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_swapDeployer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_tokenOut",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_deployer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_underlyingAmountOut0",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_underlyingAmountOut1",
            "type": "uint256"
          },
          {
            "internalType": "int24",
            "name": "_tickLower",
            "type": "int24"
          },
          {
            "internalType": "int24",
            "name": "_tickUpper",
            "type": "int24"
          },
          {
            "internalType": "uint24",
            "name": "_fee",
            "type": "uint24"
          }
        ],
        "internalType": "struct FunctionParameters.ExternalPositionUpdateRangeParamsAlgebra",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "updateRange",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "upgradeTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export const TOKEN_BALANCE_LIBRARY_ABI = [
  "function getTokenBalance(address token, address account) view returns (uint256)"
];

export const SWAP_VERIFICATION_LIBRARY_ALGEBRA_ABI = [
  "function verifySwap(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin) view returns (bool)"
];

// Contract Addresses
export const TOKEN_BALANCE_LIBRARY_ADDRESS = import.meta.env.VITE_TOKEN_BALANCE_LIBRARY_ADDRESS;
export const SWAP_VERIFICATION_LIBRARY_ALGEBRA_ADDRESS = import.meta.env.VITE_SWAP_VERIFICATION_LIBRARY_ALGEBRA_ADDRESS; 
export const ENSO_HANDLER_ADDRESS = import.meta.env.VITE_ENSO_HANDLER_ADDRESS;
export const POSITION_MANAGER_ABI = [
  "function getDeployedPositionWrappersLength() view returns (uint256)",
  "function deployedPositionWrappers(uint256) view returns (address)",
  "function createNewWrapperPosition(address token0, address token1, string memory name, string memory symbol, string memory tickLower, string memory tickUpper) returns (address)"
];

export const REBALANCING_ABI =  [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "AmountCannotBeZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "BalanceOfHandlerShouldNotExceedDust",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "BalanceOfVaultCannotNotBeZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "BalanceOfVaultIsZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "BalanceOfVaultShouldNotExceedDust",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "BorrowFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "BorrowTokenLimitExceeded",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CallerNotAssetManager",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ClaimFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidBuyTokenList",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidSolver",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidTokenRemovalPercentage",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "IsPortfolioToken",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotPortfolioToken",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProtocolIsPaused",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RewardTargetNotEnabled",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
      }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_tokenToBorrow",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_amountToBorrow",
        "type": "uint256"
      }
    ],
    "name": "Borrowed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_target",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "ClaimedRewardTokens",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "controller",
        "type": "address"
      }
    ],
    "name": "CollateralTokensDisabled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "controller",
        "type": "address"
      }
    ],
    "name": "CollateralTokensEnabled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_debtToken",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_protocolToken",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_repayAmount",
        "type": "uint256"
      }
    ],
    "name": "DirectTokenRepayed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "vault",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "atSnapshotId",
        "type": "uint256"
      }
    ],
    "name": "PortfolioTokenRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "_factory",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token0",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token1",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_flashLoanToken",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "_debtToken",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_protocolToken",
            "type": "address[]"
          },
          {
            "internalType": "address",
            "name": "_solverHandler",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_swapHandler",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_bufferUnit",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "_flashLoanAmount",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_debtRepayAmount",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_poolFees",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes[]",
            "name": "firstSwapData",
            "type": "bytes[]"
          },
          {
            "internalType": "bytes[]",
            "name": "secondSwapData",
            "type": "bytes[]"
          },
          {
            "internalType": "bool",
            "name": "isMaxRepayment",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isDexRepayment",
            "type": "bool"
          }
        ],
        "indexed": false,
        "internalType": "struct FunctionParameters.RepayParams",
        "name": "",
        "type": "tuple"
      }
    ],
    "name": "TokenRepayed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "sellTokens",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "newTokens",
        "type": "address[]"
      }
    ],
    "name": "UpdatedTokens",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "name": "UpdatedWeights",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "TOTAL_WEIGHT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "accessController",
    "outputs": [
      {
        "internalType": "contract IAccessController",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_pool",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "_tokens",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "_tokenToBorrow",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_controller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amountToBorrow",
        "type": "uint256"
      }
    ],
    "name": "borrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenToBeClaimed",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_target",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_claimCalldata",
        "type": "bytes"
      }
    ],
    "name": "claimRewardTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_debtToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_repayAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_repayAmount",
        "type": "uint256"
      }
    ],
    "name": "directDebtRepayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_tokens",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "_controller",
        "type": "address"
      }
    ],
    "name": "disableCollateralTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_tokens",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "_controller",
        "type": "address"
      }
    ],
    "name": "enableCollateralTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_portfolio",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_accessController",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_borrowManager",
        "type": "address"
      }
    ],
    "name": "init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "portfolio",
    "outputs": [
      {
        "internalType": "contract IPortfolio",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolConfig",
    "outputs": [
      {
        "internalType": "contract IProtocolConfig",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "name": "removeNonPortfolioToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_percentage",
        "type": "uint256"
      }
    ],
    "name": "removeNonPortfolioTokenPartially",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "name": "removePortfolioToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_percentage",
        "type": "uint256"
      }
    ],
    "name": "removePortfolioTokenPartially",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_controller",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "_factory",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token0",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_token1",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_flashLoanToken",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "_debtToken",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_protocolToken",
            "type": "address[]"
          },
          {
            "internalType": "address",
            "name": "_solverHandler",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_swapHandler",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_bufferUnit",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "_flashLoanAmount",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_debtRepayAmount",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_poolFees",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes[]",
            "name": "firstSwapData",
            "type": "bytes[]"
          },
          {
            "internalType": "bytes[]",
            "name": "secondSwapData",
            "type": "bytes[]"
          },
          {
            "internalType": "bool",
            "name": "isMaxRepayment",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isDexRepayment",
            "type": "bool"
          }
        ],
        "internalType": "struct FunctionParameters.RepayParams",
        "name": "repayData",
        "type": "tuple"
      }
    ],
    "name": "repay",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokensBorrowed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "_newTokens",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_sellTokens",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_sellAmounts",
            "type": "uint256[]"
          },
          {
            "internalType": "address",
            "name": "_handler",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "_callData",
            "type": "bytes"
          }
        ],
        "internalType": "struct FunctionParameters.RebalanceIntent",
        "name": "rebalanceData",
        "type": "tuple"
      }
    ],
    "name": "updateTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_sellTokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_sellAmounts",
        "type": "uint256[]"
      },
      {
        "internalType": "address",
        "name": "_handler",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_callData",
        "type": "bytes"
      }
    ],
    "name": "updateWeights",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "upgradeTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]

export const POSITION_WRAPPER_ABI =  [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "AlreadyInitialized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CallerNotAdmin",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PositionWrapperTokenIdIsTheSame",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
      }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TokensBurned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TokensMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_positionManager",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_token0",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_token1",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_symbol",
        "type": "string"
      }
    ],
    "name": "init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialFee",
    "outputs": [
      {
        "internalType": "uint24",
        "name": "",
        "type": "uint24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialMint",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialTickLower",
    "outputs": [
      {
        "internalType": "int24",
        "name": "",
        "type": "int24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialTickUpper",
    "outputs": [
      {
        "internalType": "int24",
        "name": "",
        "type": "int24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "parentPositionManager",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "positionManager",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint24",
        "name": "_fee",
        "type": "uint24"
      },
      {
        "internalType": "int24",
        "name": "_tickLower",
        "type": "int24"
      },
      {
        "internalType": "int24",
        "name": "_tickUpper",
        "type": "int24"
      }
    ],
    "name": "setIntitialParameters",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "setTokenId",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token0",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token1",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint24",
        "name": "_newFee",
        "type": "uint24"
      },
      {
        "internalType": "int24",
        "name": "_newTickLower",
        "type": "int24"
      },
      {
        "internalType": "int24",
        "name": "_newTickUpper",
        "type": "int24"
      }
    ],
    "name": "updateTokenId",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "upgradeTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]