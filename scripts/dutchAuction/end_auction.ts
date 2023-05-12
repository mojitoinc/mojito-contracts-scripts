import { ethers, network } from "hardhat";

async function main() {
    
    // network and User object
    const [owner] = await ethers.getSigners();
    console.log("Deploying to network:", network.name);
    console.log("Deploying from account:", owner.address);
  
    // Dutch Auction contract Address     
    const AuctionContractAddress = "0xED30658e32709f2292B1fa5dc3f20951D87F4D9f"; 

    // getting the reference of the deployed Dutch Auction Contract
    const Auction = await ethers.getContractAt(
        "DutchAuction",
        AuctionContractAddress
    );
    console.log("Auction Contract Deployed on :", Auction.address);

    // Auction Id
    const auctionId = "3f594d54-e14d-40fe-99e4-c86bb3cf96";     
   
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