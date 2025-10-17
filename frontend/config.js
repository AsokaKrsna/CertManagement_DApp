// Configuration file for the DApp
// Update these values after deploying your contract

const CONFIG = {
    // Contract address - UPDATE THIS after deployment
    CONTRACT_ADDRESS: "0xA2710012eE8a515e340f90B2f4952ad621F0e118",
    
    // Network configurations
    NETWORKS: {
        // Local Ganache
        1337: {
            name: "Ganache Local",
            rpcUrl: "http://127.0.0.1:7545",
            chainId: 1337
        },
        // Sepolia Testnet
        11155111: {
            name: "Sepolia Testnet",
            rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
            chainId: 11155111,
            blockExplorer: "https://sepolia.etherscan.io"
        }
    },
    
    // Contract ABI - This matches our TranscriptVerification.sol contract
    CONTRACT_ABI: [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "certHash",
                    "type": "bytes32"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "student",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "issuer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "driveLink",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "CertificateIssued",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "certHash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "reason",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "CertificateRevoked",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "registrar",
                    "type": "address"
                }
            ],
            "name": "RegistrarAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "registrar",
                    "type": "address"
                }
            ],
            "name": "RegistrarRemoved",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_registrar",
                    "type": "address"
                }
            ],
            "name": "addRegistrar",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "admin",
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
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "certificates",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "certHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "address",
                    "name": "issuer",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "student",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "driveLink",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "issueDate",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "revoked",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "revokeDate",
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
                    "name": "_certHash",
                    "type": "bytes32"
                }
            ],
            "name": "getCertificate",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "bytes32",
                            "name": "certHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "issuer",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "student",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "driveLink",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "issueDate",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "revoked",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
                            "name": "revokeDate",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct TranscriptVerification.Certificate",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getTotalCertificates",
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
                    "name": "_address",
                    "type": "address"
                }
            ],
            "name": "isRegistrar",
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
                    "name": "_certHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "address",
                    "name": "_student",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_driveLink",
                    "type": "string"
                }
            ],
            "name": "issueCertificate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_registrar",
                    "type": "address"
                }
            ],
            "name": "removeRegistrar",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_certHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "_reason",
                    "type": "string"
                }
            ],
            "name": "revokeCertificate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_certHash",
                    "type": "bytes32"
                }
            ],
            "name": "verifyCertificate",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                },
                {
                    "components": [
                        {
                            "internalType": "bytes32",
                            "name": "certHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "issuer",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "student",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "driveLink",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "issueDate",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "revoked",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
                            "name": "revokeDate",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct TranscriptVerification.Certificate",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
};

// Make CONFIG available globally
window.CONFIG = CONFIG;
