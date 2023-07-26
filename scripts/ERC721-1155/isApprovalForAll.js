const Web3 = require('web3');
require('dotenv').config();

// Read the RPC URL and private key from .env file
const providerUrl = process.env.SEPOLIA_RPC_URL;
const web3 = new Web3(providerUrl);

// Replace 'NftCollectionAddress' with the actual deployed contract address
const NftCollectionAddress = "0xe4ae9726A027C9742cca5fa8AbD4043A01bfc95A";

// Load the smart contract ABI
const contractABI = require('../../scripts/ERC721-1155/ERC721_ABI.json'); // Adjust the path accordingly

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, NftCollectionAddress);

// Function to interact with the smart contract without sendTransaction
async function interactWithContract() {
  try {
    const owner = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8";      // Token Owner Address
    const operator = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8"   // operator address
    
    // Call the write function (send transaction)    
    const result = await contract.methods.isApprovedForAll(owner, operator).call();
    console.log('Result of isApprovedForAll:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

interactWithContract();