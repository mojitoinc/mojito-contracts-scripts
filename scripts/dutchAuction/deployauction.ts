import { ethers, network } from "hardhat";
import { Contract } from "ethers";


async function main() {
    
    // network and User object
    const [owner] = await ethers.getSigners();
    console.log("Deploying to network:", network.name);
    console.log("Deploying from account:", owner.address);
  
    let dutchContract: Contract;
    let dutchUtility:Contract;

    // Royalty Contract Address
    const RoyaltyContractAddress = " ";
    
    // Deployment: Dutch Auction Contract
    const AuctionUtill = await ethers.getContractFactory("DutchUtility");
    dutchUtility = await AuctionUtill.deploy();
    await dutchUtility.deployed();        

    const Auction = await ethers.getContractFactory("DutchAuction");
    dutchContract = await Auction.deploy(RoyaltyContractAddress,dutchUtility.address);
    await dutchContract.deployed();

    await dutchUtility.initializeDutchContract(dutchContract.address);
  
    console.log("Dutch Auction contract deployed to:", dutchContract.address);
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
