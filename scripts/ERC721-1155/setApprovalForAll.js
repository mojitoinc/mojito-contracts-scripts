const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

// Read the RPC URL and private key from .env file
const providerUrl = process.env.SEPOLIA_RPC_URL;
const web3 = new Web3(providerUrl);
const privateKey = process.env.SEPOLIA_PRIVATE_KEY;

// Replace 'NftCollectionAddress' with the actual deployed contract address
const NftCollectionAddress = "0xe4ae9726A027C9742cca5fa8AbD4043A01bfc95A";

// Load the smart contract ABI
const contractABI = require('../../scripts/ERC721-1155/ERC721_ABI.json'); // Adjust the path accordingly

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, NftCollectionAddress);

// Function to interact with the smart contract without sendTransaction
async function interactWithContract() {
    try {

        // Replace 'OPERATOR_ADDRESS' with the address of the operator you want to approve or revoke
        const operatorAddress = 'OPERATOR_ADDRESS';

        // Replace 'APPROVE' with true to approve the operator or false to revoke the approval
        const approve = true;

        // Call the write function (send transaction)    
        const result = await contract.methods.setApprovalForAll(operator, approve).send({ from: privateKey });
        console.log('Result of setApprovalForAll:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

interactWithContract();