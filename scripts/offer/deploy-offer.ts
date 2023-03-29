import { ethers } from "hardhat";

async function main() {
  // Mumbai Addresses
  const WETH_ADDRESS = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";

  // User Object
  const accounts = await ethers.getSigners();
  const user = accounts[1];
  console.log(`account address: ${user.address}`);
  // Deployment: BuyNow Contract
  const OfferContract = await ethers.getContractFactory("Offers");
  const offercontract = await OfferContract.deploy(
    WETH_ADDRESS
  );
  await offercontract.deployed();
  console.log(`Offer Contract deployed to: ${offercontract.address}`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.error);
    process.exit(1);
  });
