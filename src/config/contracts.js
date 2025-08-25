import { ethers } from "ethers";
// Contract Addresses
export const PORTFOLIO_FACTORY_ADDRESS = "0xBB5c5929dC2322e5F93EE23648df9eaEa9918E0D"
export const TREASURY_ADDRESS = "0x04d740D2D93AF7417060Ec7b35415c81820470d0"

// Protocol Configuration
export const THENA_PROTOCOL_HASH = "0xa86b32b5c032e5b3190e650ceaca953a6eaf8b7a3cd0a8f0332ff19dc3adbd13"

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
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ETHTransferredToVault",
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
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TokenTransferredToVault",
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
    "name": "ETHERNAL_FARMING_ADDRESS",
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
    "name": "FARMING_CENTER_ADDRESS",
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "rewardToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "bonusRewardToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      }
    ],
    "name": "approveAndAddForFarming",
    "outputs": [],
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
        "components": [
          {
            "internalType": "address",
            "name": "rewardToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "bonusRewardToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "pool",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          }
        ],
        "internalType": "struct IFarmingCenter.IncentiveKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "claimRewards",
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
    "name": "collectFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
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
        "internalType": "struct WrapperFunctionParameters.PositionMintParamsAlgebra",
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
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint24",
        "name": "",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "rewardToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "bonusRewardToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      }
    ],
    "name": "exitFarming",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "internalType": "address",
        "name": "_vault",
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
        "internalType": "struct WrapperFunctionParameters.InitialMintParamsAlgebra",
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
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "name": "transferTokenToVault",
    "outputs": [],
    "stateMutability": "nonpayable",
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
]

export const SWAP_VERIFICATION_LIBRARY_ALGEBRA_ABI = [
  "function verifySwap(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin) view returns (bool)"
];

// Contract Addresses
export const TOKEN_BALANCE_LIBRARY_ADDRESS = "0xb95dc48774d9B9EF7b8CCe19068b41B9e10463df";
export const SWAP_VERIFICATION_LIBRARY_ALGEBRA_ADDRESS = "0x60c29EF13b2629fD0B5aB36410401D81D47BD349";
export const ENSO_HANDLER_ADDRESS = "0x7133A7f3bBea06584fB439c1F9E9cc80FEf59c2e";
export const POSITION_MANAGER_ABI = [
  "function getDeployedPositionWrappersLength() view returns (uint256)",
  "function deployedPositionWrappers(uint256) view returns (address)",
  "function createNewWrapperPosition(address token0, address token1, string memory name, string memory symbol, string memory tickLower, string memory tickUpper) returns (address)"
];

export const REBALANCING_ABI = [
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

export const POSITION_WRAPPER_ABI = [
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

export const AMOUNT_CALCULATIONS_ALGEBRA_ABI = [
  {
    "inputs": [],
    "name": "tickOutOfRange",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "getFeesCollected",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "tokensOwed0",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "tokensOwed1",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
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
        "name": "_percentage",
        "type": "uint256"
      }
    ],
    "name": "getLiquidityAmountsForPartialWithdrawal",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount0Out",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount1Out",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_partially",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_total",
        "type": "uint256"
      }
    ],
    "name": "getPercentage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "percentage",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IPositionWrapper",
        "name": "_positionWrapper",
        "type": "address"
      }
    ],
    "name": "getRatio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "ratio",
        "type": "uint256"
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
    "name": "getRatioAmountsForTicks",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
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
      }
    ],
    "name": "getRatioOfPool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "ratio",
        "type": "uint256"
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
      }
    ],
    "name": "getUnderlyingAmounts",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const AMOUNT_CALCULATIONS_ALGEBRA_ADDRESS = "0xA49419ecDBF7b4b25d2C575182Ed69A25C0A6e81"

export const DEPOSIT_BATCH_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_swapTarget",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "DepositBatchCallFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidBalance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidBalanceDiff",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransferFailed",
    "type": "error"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_minMintAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_depositAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_target",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_depositToken",
            "type": "address"
          },
          {
            "internalType": "bytes[]",
            "name": "_callData",
            "type": "bytes[]"
          }
        ],
        "internalType": "struct FunctionParameters.BatchHandler",
        "name": "data",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "_positionWrappers",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_swapTokens",
            "type": "address[]"
          },
          {
            "internalType": "address",
            "name": "_deployer",
            "type": "address"
          },
          {
            "internalType": "uint256[]",
            "name": "_positionWrapperIndex",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_portfolioTokenIndex",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_index0",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_index1",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amount0Min",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amount1Min",
            "type": "uint256[]"
          },
          {
            "internalType": "bool[]",
            "name": "_isExternalPosition",
            "type": "bool[]"
          },
          {
            "internalType": "address[]",
            "name": "_swapDeployer",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_tokenIn",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_tokenOut",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amountIn",
            "type": "uint256[]"
          },
          {
            "internalType": "uint24[]",
            "name": "_fee",
            "type": "uint24[]"
          }
        ],
        "internalType": "struct FunctionParameters.ExternalPositionDepositParams",
        "name": "_params",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "multiTokenSwapAndDeposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_minMintAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_depositAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_target",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_depositToken",
            "type": "address"
          },
          {
            "internalType": "bytes[]",
            "name": "_callData",
            "type": "bytes[]"
          }
        ],
        "internalType": "struct FunctionParameters.BatchHandler",
        "name": "data",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "_positionWrappers",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_swapTokens",
            "type": "address[]"
          },
          {
            "internalType": "address",
            "name": "_deployer",
            "type": "address"
          },
          {
            "internalType": "uint256[]",
            "name": "_positionWrapperIndex",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_portfolioTokenIndex",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_index0",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_index1",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amount0Min",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amount1Min",
            "type": "uint256[]"
          },
          {
            "internalType": "bool[]",
            "name": "_isExternalPosition",
            "type": "bool[]"
          },
          {
            "internalType": "address[]",
            "name": "_swapDeployer",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_tokenIn",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_tokenOut",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amountIn",
            "type": "uint256[]"
          },
          {
            "internalType": "uint24[]",
            "name": "_fee",
            "type": "uint24[]"
          }
        ],
        "internalType": "struct FunctionParameters.ExternalPositionDepositParams",
        "name": "_params",
        "type": "tuple"
      }
    ],
    "name": "multiTokenSwapETHAndTransfer",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]

export const depositBatchAddress = "0x8fFe87dA29a1A9DfF64Bf1BCB3abaa2137205699"

export const priceOracleAddress = "0x50e4Bf2367A14b8A21A018Da7F033724cCcA8112"

export const PRICE_ORACLE_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_WETH",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "AggregatorAlreadyExistsError",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FeedNotFoundError",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "IncorrectArrayLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAddressError",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NonExistingFeed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PriceOracleExpired",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PriceOracleInvalid",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "base",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "quote",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "aggregator",
        "type": "address"
      }
    ],
    "name": "FeedAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "base",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "quote",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "aggregator",
        "type": "address"
      }
    ],
    "name": "FeedUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "oracleExpirationThreshold",
        "type": "uint256"
      }
    ],
    "name": "OracleExpirationThresholdUpdated",
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
    "inputs": [],
    "name": "WETH",
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
        "name": "_base",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "name": "convertToUSD18Decimals",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
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
        "name": "base",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "quote",
        "type": "address"
      }
    ],
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
    "inputs": [],
    "name": "oracleExpirationThreshold",
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
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "bases",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "quotes",
        "type": "address[]"
      },
      {
        "internalType": "contract AggregatorV2V3Interface[]",
        "name": "aggregators",
        "type": "address[]"
      }
    ],
    "name": "setFeeds",
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
        "name": "base",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "quote",
        "type": "address"
      },
      {
        "internalType": "contract AggregatorV2V3Interface",
        "name": "aggregator",
        "type": "address"
      }
    ],
    "name": "updateFeed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newTimeout",
        "type": "uint256"
      }
    ],
    "name": "updateOracleExpirationThreshold",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const venusAssetHandlerAddress = "0x996704fdb3341EbcAb3D8AD60610d18C1cF735CC"

export const VENUS_ASSET_HANDLER_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_vBNB_Address",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_WBNB_Address",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "WBNB_Address",
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
        "name": "_toApprove",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amountToApprove",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "borrowAmount",
        "type": "uint256"
      }
    ],
    "name": "borrow",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "assets",
        "type": "address[]"
      }
    ],
    "name": "enterMarket",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_portfolioTokenAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalSupply",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_counter",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "borrowedTokens",
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
    "name": "executeUserFlashLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_receiver",
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
    "name": "executeVaultFlashLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "asset",
        "type": "address"
      }
    ],
    "name": "exitMarket",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "comptroller",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "name": "getAllProtocolAssets",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "lendTokens",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "borrowTokens",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "asset",
        "type": "address"
      }
    ],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "balance",
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
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "comptroller",
        "type": "address"
      }
    ],
    "name": "getBorrowedTokens",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "borrowedTokens",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_controller",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "_protocolToken",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "lendTokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_debtRepayAmount",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "feeUnit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalCollateral",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bufferUnit",
        "type": "uint256"
      }
    ],
    "name": "getCollateralAmountToSell",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDecimals",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "decimals",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "getUnderlyingToken",
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
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "comptroller",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "name": "getUserAccountData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "totalCollateral",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalDebt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "availableBorrows",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currentLiquidationThreshold",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "ltv",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "healthFactor",
            "type": "uint256"
          }
        ],
        "internalType": "struct FunctionParameters.AccountData",
        "name": "accountData",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "lendTokens",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "borrowTokens",
            "type": "address[]"
          }
        ],
        "internalType": "struct FunctionParameters.TokenAddresses",
        "name": "tokenAddresses",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "vault",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "controller",
        "type": "address"
      }
    ],
    "name": "isCollateralEnabled",
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
        "name": "vault",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "executor",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "controller",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "lendTokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "totalCollateral",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "flashLoanToken",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "debtToken",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "protocolTokens",
            "type": "address[]"
          },
          {
            "internalType": "address",
            "name": "solverHandler",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "swapHandler",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "poolAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "bufferUnit",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "flashLoanAmount",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "debtRepayAmount",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "poolFees",
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
        "internalType": "struct FunctionParameters.FlashLoanData",
        "name": "flashData",
        "type": "tuple"
      }
    ],
    "name": "loanProcessing",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "txData",
            "type": "bytes"
          }
        ],
        "internalType": "struct IAssetHandler.MultiTransaction[]",
        "name": "transactions",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256",
        "name": "totalFlashAmount",
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
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "borrowAmount",
        "type": "uint256"
      }
    ],
    "name": "repay",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
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
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minAmountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      }
    ],
    "name": "swapTokens",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vBNB_Address",
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
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
]

export const ERC20_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
        "name": "allowance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
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
        "name": "value",
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
        "name": "value",
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
        "name": "value",
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
  }
]

export const IAllowanceTransfer = [
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
        "name": "token",
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
        "internalType": "uint160",
        "name": "amount",
        "type": "uint160"
      },
      {
        "indexed": false,
        "internalType": "uint48",
        "name": "expiration",
        "type": "uint48"
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
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "Lockdown",
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
        "name": "token",
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
        "internalType": "uint48",
        "name": "newNonce",
        "type": "uint48"
      },
      {
        "indexed": false,
        "internalType": "uint48",
        "name": "oldNonce",
        "type": "uint48"
      }
    ],
    "name": "NonceInvalidation",
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
        "name": "token",
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
        "internalType": "uint160",
        "name": "amount",
        "type": "uint160"
      },
      {
        "indexed": false,
        "internalType": "uint48",
        "name": "expiration",
        "type": "uint48"
      },
      {
        "indexed": false,
        "internalType": "uint48",
        "name": "nonce",
        "type": "uint48"
      }
    ],
    "name": "Permit",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DOMAIN_SEPARATOR",
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
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token",
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
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
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
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint48",
        "name": "newNonce",
        "type": "uint48"
      }
    ],
    "name": "invalidateNonces",
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
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "internalType": "struct IAllowanceTransfer.TokenSpenderPair[]",
        "name": "approvals",
        "type": "tuple[]"
      }
    ],
    "name": "lockdown",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "name": "permitBatch",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "permit",
    "outputs": [],
    "stateMutability": "nonpayable",
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
            "internalType": "struct IAllowanceTransfer.PermitDetails",
            "name": "details",
            "type": "tuple"
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
        "internalType": "struct IAllowanceTransfer.PermitSingle",
        "name": "permitSingle",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "permit",
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
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint160",
            "name": "amount",
            "type": "uint160"
          },
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          }
        ],
        "internalType": "struct IAllowanceTransfer.AllowanceTransferDetails[]",
        "name": "transferDetails",
        "type": "tuple[]"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
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
        "internalType": "uint160",
        "name": "amount",
        "type": "uint160"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const PORTFOLIO_CALCULATIONS_ABI =  [
  {
    "inputs": [],
    "name": "BalanceOfVaultIsZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidId",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoTokensRemoved",
    "type": "error"
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_portfolio",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_protocolToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_comptroller",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_aaveAssetHandler",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_portfolioTokenAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_flashLoanBufferUnit",
        "type": "uint256"
      }
    ],
    "name": "calculateAaveBorrowedPortionAndFlashLoanDetails",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "borrowedPortion",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "flashLoanAmount",
        "type": "uint256[]"
      },
      {
        "internalType": "address[]",
        "name": "underlyingTokens",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "borrowedTokens",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_borrowToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_borrowToRepay",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_bufferUnit",
        "type": "uint256"
      }
    ],
    "name": "calculateAaveFlashLoanAmountForRepayment",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "flashLoanAmount",
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
        "name": "_portfolio",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_protocolToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_comptroller",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_venusAssetHandler",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_portfolioTokenAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_flashLoanBufferUnit",
        "type": "uint256"
      }
    ],
    "name": "calculateBorrowedPortionAndFlashLoanDetails",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "borrowedPortion",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "flashLoanAmount",
        "type": "uint256[]"
      },
      {
        "internalType": "address[]",
        "name": "underlyingTokens",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "borrowedTokens",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_borrowProtocolToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_flashLoanProtocolToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_comptroller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_borrowToRepay",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_bufferUnit",
        "type": "uint256"
      }
    ],
    "name": "calculateFlashLoanAmountForRepayment",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "flashLoanAmount",
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
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_controller",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_aaveAssetHandler",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "_protocolToken",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "_portfolioTokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_debtRepayAmount",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "feeUnit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bufferUnit",
        "type": "uint256"
      }
    ],
    "name": "getAaveCollateralAmountToSell",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_controller",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_venusAssetHandler",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "_protocolToken",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "_portfolioTokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_debtRepayAmount",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "feeUnit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bufferUnit",
        "type": "uint256"
      }
    ],
    "name": "getCollateralAmountToSell",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
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
        "internalType": "uint256",
        "name": "_userShare",
        "type": "uint256"
      }
    ],
    "name": "getExpectedMintAmount",
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
        "name": "_portfolio",
        "type": "address"
      }
    ],
    "name": "getPerformanceFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "protocolFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "assetManagerFee",
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
        "name": "_pool",
        "type": "address"
      }
    ],
    "name": "getPoolFee",
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
        "name": "_portfolio",
        "type": "address"
      }
    ],
    "name": "getPortfolioData",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "tokenAmountArray",
        "type": "uint256[]"
      },
      {
        "internalType": "uint8[]",
        "name": "tokenDecimalArray",
        "type": "uint8[]"
      },
      {
        "internalType": "address[]",
        "name": "indexTokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "totalSupply",
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
        "name": "_portfolio",
        "type": "address"
      }
    ],
    "name": "getPortfolioDataByte",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_portfolio",
        "type": "address"
      }
    ],
    "name": "getProtocolAndManagementFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "assetManagerFeeToMint",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "protocolFeeToMint",
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
        "name": "_portfolio",
        "type": "address"
      }
    ],
    "name": "getTokenBalancesAndDecimals",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint8[]",
        "name": "",
        "type": "uint8[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "userAmounts",
        "type": "uint256[]"
      },
      {
        "internalType": "address",
        "name": "_portfolio",
        "type": "address"
      }
    ],
    "name": "getUserAmountToDeposit",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "_desiredShare",
        "type": "uint256"
      }
    ],
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
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endId",
        "type": "uint256"
      }
    ],
    "name": "getUserTokenClaimBalance",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "pools",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "vault",
        "type": "address"
      }
    ],
    "name": "getVenusTokenBorrowedBalance",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "balances",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
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
        "internalType": "address",
        "name": "_portfolio",
        "type": "address"
      }
    ],
    "name": "getWithdrawalAmounts",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const portfolioCalculationsAddress = "0xFA1989D1e0da32fAD9322Ab620F443062B858038"

export const tokenBalanceLibraryAddress = "0xb95dc48774d9B9EF7b8CCe19068b41B9e10463df"

export const TOKEN_BALANCE_LIBRARY_ABI = [
  {
    "inputs": [],
    "name": "ControllerDataNotFound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAddress",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      },
      {
        "internalType": "contract IProtocolConfig",
        "name": "_protocolConfig",
        "type": "IProtocolConfig"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "controller",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "unusedCollateralPercentage",
            "type": "uint256"
          }
        ],
        "internalType": "struct TokenBalanceLibrary.ControllerData[]",
        "name": "controllersData",
        "type": "tuple[]"
      }
    ],
    "name": "_getAdjustedTokenBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokenBalance",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isCollateralEnabled",
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
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      }
    ],
    "name": "_getTokenBalanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokenBalance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const EXTERNAL_POSITION_STORAGE_ABI =[
  {
    "inputs": [],
    "name": "CallerNotAdmin",
    "type": "error"
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_newPostion",
        "type": "address"
      }
    ],
    "name": "addWrappedPosition",
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
        "name": "",
        "type": "address"
      }
    ],
    "name": "isWrappedPosition",
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
]

export const swapVerificationLibraryAddress = "0x60c29EF13b2629fD0B5aB36410401D81D47BD349"


export const withdrawBatchAddress="0x24e2d3217ebCFf91a0Cb5556c666bEBd42432125"

export const withdrawManagerAddress="0xA857538e9b56F4a69C29285c5893A5cDDCeB941e"

export const WITHDRAW_MANAGER_ABI= [
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_withdrawBatch",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_portfolioFactory",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "portfolioFactory",
    "outputs": [
      {
        "internalType": "contract IPortfolioFactory",
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
      }
    ],
    "name": "validateTargetWhitelisting",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_swapTokens",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "_target",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenToWithdraw",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_portfolioTokenAmount",
        "type": "uint256"
      },
      {
        "internalType": "bytes[]",
        "name": "_callData",
        "type": "bytes[]"
      },
      {
        "internalType": "uint256",
        "name": "_expectedOutputAmount",
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
      },
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "_positionWrappers",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amountsMin0",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amountsMin1",
            "type": "uint256[]"
          },
          {
            "internalType": "address[]",
            "name": "_swapDeployer",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_tokenIn",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_tokenOut",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amountIn",
            "type": "uint256[]"
          },
          {
            "internalType": "uint24[]",
            "name": "_fee",
            "type": "uint24[]"
          }
        ],
        "internalType": "struct FunctionParameters.ExternalPositionWithdrawParams",
        "name": "_params",
        "type": "tuple"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const VENUS_TOKEN_ABI = [
  {
    "inputs": [],
    "name": "accrueInterest",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
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
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOfUnderlying",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
    "name": "borrowBalanceCurrent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
    "name": "borrowBalanceStored",
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
    "name": "borrowRatePerBlock",
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
    "inputs": [],
    "name": "exchangeRateCurrent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exchangeRateStored",
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
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getAccountSnapshot",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
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
    "name": "getCash",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "liquidator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "borrower",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "seizeTokens",
        "type": "uint256"
      }
    ],
    "name": "seize",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "supplyRatePerBlock",
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
    "name": "totalBorrowsCurrent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "dst",
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
        "name": "src",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "dst",
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
    "inputs": [],
    "name": "underlying",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const depositManagerAddress = "0x7713e006D0476770fa90e5bdBeDaF28CFce1C57c";

export const DEPOSIT_MANAGER_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_depositBatch",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "DEPOSIT_BATCH",
    "outputs": [
      {
        "internalType": "contract IDepositBatchExternalPositions",
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
            "name": "_minMintAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_depositAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_target",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_depositToken",
            "type": "address"
          },
          {
            "internalType": "bytes[]",
            "name": "_callData",
            "type": "bytes[]"
          }
        ],
        "internalType": "struct FunctionParameters.BatchHandler",
        "name": "data",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "_positionWrappers",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_swapTokens",
            "type": "address[]"
          },
          {
            "internalType": "address",
            "name": "_deployer",
            "type": "address"
          },
          {
            "internalType": "uint256[]",
            "name": "_positionWrapperIndex",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_portfolioTokenIndex",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_index0",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_index1",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amount0Min",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amount1Min",
            "type": "uint256[]"
          },
          {
            "internalType": "bool[]",
            "name": "_isExternalPosition",
            "type": "bool[]"
          },
          {
            "internalType": "address[]",
            "name": "_swapDeployer",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_tokenIn",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_tokenOut",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_amountIn",
            "type": "uint256[]"
          },
          {
            "internalType": "uint24[]",
            "name": "_fee",
            "type": "uint24[]"
          }
        ],
        "internalType": "struct FunctionParameters.ExternalPositionDepositParams",
        "name": "_params",
        "type": "tuple"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const FACTORY_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "poolByPair",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const FACTORY_ADDRESS = "0x30055F87716d3DFD0E5198C27024481099fB4A98"

export const POOL_TO_KEY_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      }
    ],
    "name": "poolToKey",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "rewardToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "bonusRewardToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "pool",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          }
        ],
        "internalType": "struct IFarmingCenter.IncentiveKey",
        "name": "key",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const SWAP_VERIFICATION_LIBRARY_ABI=[
  {
    "inputs": [],
    "name": "InvalidSwap",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidSwapAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidSwapToken",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "tickOutOfRange",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "contract IProtocolConfig",
        "name": "protocolConfig",
        "type": "IProtocolConfig"
      },
      {
        "components": [
          {
            "internalType": "contract IPositionWrapper",
            "name": "_positionWrapper",
            "type": "IPositionWrapper"
          },
          {
            "internalType": "uint256",
            "name": "_tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amountIn",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_swapDeployer",
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
            "name": "_tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_tokenOut",
            "type": "address"
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
        "internalType": "struct WrapperFunctionParameters.SwapParams",
        "name": "_params",
        "type": "tuple"
      }
    ],
    "name": "checkSwapAmountIsDust",
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
        "name": "_nftManager",
        "type": "address"
      }
    ],
    "name": "getFactoryAddress",
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
        "internalType": "contract IProtocolConfig",
        "name": "_protocolConfig",
        "type": "IProtocolConfig"
      },
      {
        "internalType": "uint256",
        "name": "_balanceBeforeSwap",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_balanceAfterSwap",
        "type": "uint256"
      }
    ],
    "name": "verifyOneSidedRatio",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_sellToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_buyToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_sellAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_buyAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_slippage",
        "type": "uint256"
      },
      {
        "internalType": "contract IPriceOracle",
        "name": "_priceOracle",
        "type": "IPriceOracle"
      }
    ],
    "name": "verifySwap",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  }
]