const { ethers } = require('ethers');
require('dotenv').config();
const ERC721Abi = require('./ERC721_ABI.json');

async function main() {

  // Replace 'NftCollectionAddress' with the actual deployed contract address
  const NftCollectionAddress = "0xe4ae9726A027C9742cca5fa8AbD4043A01bfc95A";

    // Connect to the network using the ABI and the signer 
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(NftCollectionAddress, ERC721Abi, wallet);

    const network = await provider.getNetwork();
    const networkName = network.name;
    const chainId = network.chainId;
    let user = wallet.address;

    console.log("NetworkName                       :", networkName);
    console.log("NetworkChainId                    :", chainId);
    console.log("NFT Contract Deployed on          :", contract.address);
    console.log("Transaction will be executed from :", user);

   
    const owner = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8";      // Token Owner Address
    const operator = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8"   // operator address

    // Call the isApprovedForAll()   
    let Result = await contract.isApprovedForAll(owner, operator);
    console.log('Result of isApprovedForAll:', Result);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
