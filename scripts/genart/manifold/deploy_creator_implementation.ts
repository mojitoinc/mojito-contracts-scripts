import { ethers, network } from "hardhat";
import { Contract } from "ethers";


async function logReceipt(receipt: any) {
  console.log(`tx hash: ${receipt.hash}, waiting for confirmations...`);
  const tx = await receipt.wait(1);
  console.log(`Gas used: ${tx.gasUsed.toString()}`);
}

async function main() {
  const [owner, recipient, bidder] = await ethers.getSigners();
  console.log("Deploying to network:", network.name);
  console.log("Deploying from account:", owner.address);

  let creatorImplementation: Contract;
  
  const ERC721CreatorImplementation = await ethers.getContractFactory("ERC721CreatorImplementation");
  creatorImplementation = await ERC721CreatorImplementation.deploy();
  await creatorImplementation.deployed();

  console.log("Creator Implementation contract deployed to:", creatorImplementation.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
