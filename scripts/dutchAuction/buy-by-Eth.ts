import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";

  /************ Sample Data for buy()******************************
  
  auctionId : "88e0d944-04ab-4ed3-9f8b-c6d2023fd6af"
  buyingAmount : 10000000000000000
  tax: 0
  totalBuytoken : 1
  quantity : 0
  BlacklistProof : [0x0000000000000000000000000000000000000000000000000000000000000000]
 
  */

async function main() {
    
    // network and User object
    const [owner] = await ethers.getSigners();
    console.log("Deploying to network:", network.name);
    console.log("Deploying from account:", owner.address);
  
    // Dutch Auction contract Address     
    const AuctionContractAddress = "0xBE6F430D96a4Ae28a3401Af5154D8fD8173F2680"; 
    // Dutch Utility contract Address 
    const AuctionUtilityAddress = "0x44092487B4B66b53E5D5f2B463B6721b7A232204";
    
    // getting the reference of the deployed Dutch Auction Contract
    const Auction = await ethers.getContractAt(
        "DutchAuction",
        AuctionContractAddress
    );

    // getting the reference of the deployed Dutch Utility Contract
    const AuctionUtility = await ethers.getContractAt(
      "DutchUtility",
      AuctionUtilityAddress
  );

    console.log("Auction Contract Deployed on :", Auction.address);    

    const auctionId = "2010";                                                   // Auction Id
    
    // getting the current dutch auction price
    const currentPrice= await AuctionUtility.getCurrentDutchPrice(auctionId);

    const totalBuytoken = 2;                                                    // token count to buy    
    const buyingAmount = currentPrice.mul(totalBuytoken);                       // calcualted Buying amount based on current price and no of tokens
    const tax = 0;                                                              // tax of buying Amount.
    const quantity = 0;                                                         // Quantity should be zero for ERC721
    const BlacklistProof = ethers.constants.HashZero;                           // default should be zero
    
    console.log("Current Price",currentPrice.toString())
    console.log("BuyAmount",buyingAmount.toString());
    
    // call to buy the token(s)
    let receipt = await Auction.buy(
      auctionId,
      buyingAmount,
      tax,
      totalBuytoken,
      quantity,
      [BlacklistProof],
      { value: buyingAmount+tax}
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



