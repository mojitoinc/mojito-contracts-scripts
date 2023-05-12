import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";


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

    

    const auctionId = "3f594d54-e14d-40fe-99e4-c86bb3cf96";                     // Auction Id
    const totalBuytoken = 1;                                                    // token count to buy
    
    // getting the current dutch auction price
    const currentPrice= await Auction.getCurrentDutchPrice(auctionId);

    console.log("Current Price",currentPrice)

    const buyingAmount = currentPrice.mul(totalBuytoken);                       // calcualted Buying amount based on current price and no of tokens
    
    const quantity = 0;                                                         // Quantity should be zero for ERC721
    const BlacklistProof = ethers.constants.HashZero;                           // default should be zero
    
    // call to buy the token(s)
    let receipt = await Auction.buy(
      auctionId,buyingAmount,
      totalBuytoken,quantity,
      [BlacklistProof],
      { value: buyingAmount}
      );

    console.log(`\n transaction hash of buy, tx hash: ${receipt.hash}`);
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