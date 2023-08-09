const { ethers } = require('ethers');
require('dotenv').config();
const AuctionAbi = require('./AuctionAbi.json');

async function main() {

    // Onchain Auction contract Address     
    const auctionContractAddress = "0x30a32FBA51E2edFdF124c4ff9Bc3824384DB8B1f";

    // Connect to the network using the ABI and the signer 
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
    const Auction = new ethers.Contract(auctionContractAddress, AuctionAbi, wallet);

    const network = await provider.getNetwork();
    const networkName = network.name;
    const chainId = network.chainId;
    let user = wallet.address;

    console.log("NetworkName                       :", networkName);
    console.log("NetworkChainId                    :", chainId);
    console.log("Auction Contract Deployed on      :", Auction.address);
    console.log("Transaction will be executed from :", user);

    // Auction Id
    const auctionId = "2020";

    // call to buy the token(s)
    let receipt = await Auction.endAuction(auctionId);

    console.log(`\n transaction hash of End Auction, tx hash: ${receipt.hash}`);
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