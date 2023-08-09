const { ethers } = require('ethers');
require('dotenv').config();
const SplitterAbi = require('./SplitterAbi.json');

async function main() {

    // PaymentSplitter contract Address     
    const splitterContractAddress = "";

    // Connect to the network using the ABI and the signer 
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
    const Splitter = new ethers.Contract(splitterContractAddress, SplitterAbi, wallet);

    const network = await provider.getNetwork();
    const networkName = network.name;
    const chainId = network.chainId;
    let user = wallet.address;

    console.log("NetworkName                       :", networkName);
    console.log("NetworkChainId                    :", chainId);
    console.log("Splitter Contract Deployed on     :", Splitter.address);
    console.log("Transaction will be executed from :", user);
       
    const tokenAddress = "";              // Asset address.For ETH , Pass zero address, For ERC20, Contract address of ERC20 Asset
    
    // call to release the funds of all share holders
    let receipt = await Splitter.releaseAll(tokenAddress);

    console.log(`\n transaction hash of releaseAll, tx hash: ${receipt.hash}`);
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