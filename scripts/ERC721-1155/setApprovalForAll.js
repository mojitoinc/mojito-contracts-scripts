const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

// Read the RPC URL and private key from .env file
const providerUrl = process.env.SEPOLIA_RPC_URL;
const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
let provider = new HDWalletProvider(privateKey, providerUrl);
const web3 = new Web3(provider);


// Replace 'NftCollectionAddress' with the actual deployed contract address
const NftCollectionAddress = "0xe4ae9726A027C9742cca5fa8AbD4043A01bfc95A";

// Load the smart contract ABI
const contractABI = require('../../scripts/ERC721-1155/ERC721_ABI.json'); // Adjust the path accordingly

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, NftCollectionAddress);

// Function to interact with the smart contract without sendTransaction
async function interactWithContract() {
    try {
        const network = await web3.eth.net.getId()
        const accounts = await web3.eth.getAccounts();
             
        console.log("networkChainId =", network);
        console.log("NFT Contract Contract Deployed on :", NftCollectionAddress);
        console.log("transaction will be executed from :", accounts[0]);
        
        // Replace 'OPERATOR_ADDRESS' with the address of the operator you want to approve or revoke
        const operatorAddress = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8";

        // Replace 'APPROVE' with true to approve the operator or false to revoke the approval
        const approve = true;

        // Call the write function (send transaction)    
        const receipt = await contract.methods.setApprovalForAll(operatorAddress, approve).send({ from: accounts[0] });
        console.log('Tnx hash of setApprovalForAll:', receipt.transactionHash);
    } catch (error) {
        console.error('Error:', error);
    }
}

interactWithContract();