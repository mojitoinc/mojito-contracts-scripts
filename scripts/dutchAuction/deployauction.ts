import { ethers, network } from "hardhat";
import { Contract } from "ethers";


async function main() {
    
    // network and User object
    const [owner] = await ethers.getSigners();
    console.log("Deploying to network:", network.name);
    console.log("Deploying from account:", owner.address);
  
    let dutchContract: Contract;
    
    // Deployment: Dutch Auction Contract
    const DutchAuctionContract = await ethers.getContractFactory("DutchAuction");
    dutchContract = await DutchAuctionContract.deploy(ethers.constants.AddressZero);
    await dutchContract.deployed();
  
    console.log("Dutch Auction contract deployed to:", dutchContract.address);
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
