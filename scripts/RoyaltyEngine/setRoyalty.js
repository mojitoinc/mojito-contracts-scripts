const { ethers } = require('ethers');
require('dotenv').config();
const RoyaltyEngineAbi = require('./RoyaltyEngineAbi.json');

async function main() {

    // RoyaltyEngineAbi contract Address     
    const royaltyEngineContractAddresss = "0xb23a6677776bC53Fe4f65B2082c996D9638FDc87";

    // Connect to the network using the ABI and the signer 
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
    const RoyaltyEngine = new ethers.Contract(royaltyEngineContractAddresss, RoyaltyEngineAbi, wallet);

    const network = await provider.getNetwork();
    const networkName = network.name;
    const chainId = network.chainId;
    let user = wallet.address;

    console.log("NetworkName                          :", networkName);
    console.log("NetworkChainId                       :", chainId);
    console.log("RoyaltyEngine Contract Deployed on   :", RoyaltyEngine.address);
    console.log("Transaction will be executed from    :", user);
       
    const collectionAddress = "0x3e9D45aD0da57683b5375d0F3D5BC606429128F9"; // Pass the Nft Collection
    const receivers = ["0x3c65AFAF9115C8B6b6240113713449cf1c67a42A"];       // Pass the Receivers addresses
    const basisPoints  = [200];                                             // Pass the Royalty shares in Basic Points
   
    // call to set the Royalty at collection level
    let receipt = await RoyaltyEngine.setRoyalty(
        collectionAddress,
        receivers,
        basisPoints
        );

    console.log(`\n transaction hash of setRoyalty , tx hash: ${receipt.hash}`);
    console.log("Waiting for confirmations...");
    const tx = await receipt.wait(1);
    console.log(`Confirmed! Gas used: ${tx.gasUsed.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });