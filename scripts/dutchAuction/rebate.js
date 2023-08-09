const { ethers } = require('ethers');
require('dotenv').config();
const DutchContractAbi = require('./DutchAuctionAbi.json');

async function main() {

  // Dutch Auction contract Address     
  const auctionContractAddress = "0x30a32FBA51E2edFdF124c4ff9Bc3824384DB8B1f";

  // Connect to the Selpolia network using the ABI and the signer from Hardhat 
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider); // Use the SEPOLIA_PRIVATE_KEY from the .env file
  const Auction = new ethers.Contract(auctionContractAddress, DutchContractAbi, wallet);

  const network = await provider.getNetwork();
  const networkName = network.name;
  const chainId = network.chainId;
  let user = wallet.address;

  console.log("NetworkName                       :", networkName);
  console.log("NetworkChainId                    :", chainId);
  console.log("Auction Contract Deployed on      :", Auction.address);
  console.log("Transaction will be executed from :", user);


  // Replace 'Auction Id" 
  const auctionId = "2020";  
  // Replace the User Wallet Address to rebate                          
  const buyerWalletAddress = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8"                               

  // call to buy the token(s)
  let receipt = await Auction.rebate(auctionId, buyerWalletAddress);

  console.log(`\n transaction hash of created sale, tx hash: ${receipt.hash}`);
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