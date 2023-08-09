const { ethers } = require('ethers');
const { BigNumber } = require("ethers");
require('dotenv').config();
const AuctionAbi = require('./AuctionAbi.json');

const toTimestamp = (strDate) => {
    const dt = new Date(strDate).getTime();
    return dt / 1000;
};

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

    const auctionID = "2020"                                        // Auction ID
    const bidAmount = ethers.utils.parseUnits("0.01", "ether");     // bid amount, it shuld be higher than Pervious bid.
    const tax = ethers.utils.parseUnits("0", "ether");              // Tax value for given Bid Amount
    const whitelistedProof = ethers.constants.AddressZero;          // default should be zero
    const blacklistedProof = ethers.constants.AddressZero;          // default should be zero

    console.log("bidAmount:", bidAmount.toString());
    console.log("tax", tax.toString());    

   
    // call to bid() in the auction contract
    let receipt = await Auction.bid(
        auctionID,
        bidAmount,
        tax,
        [whitelistedProof],
        [blacklistedProof]
    );
    console.log(`\n transaction hash of created sale, tx hash: ${receipt.hash}`);
    console.log("Waiting for confirmations...");
    const tx = await receipt.wait(1);
    console.log(`Confirmed! Gas used: ${tx.gasUsed.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error.error);
        process.exit(1);
    });
