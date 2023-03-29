import { run, ethers, network } from "hardhat";
import { Contract } from "ethers";

const BASE_URI = "ar://placeholder/";

async function logReceipt(receipt: any) {
  console.log(`tx hash: ${receipt.hash}, waiting for confirmations...`);
  const tx = await receipt.wait(1);
  console.log(`Gas used: ${tx.gasUsed.toString()}`);
}

async function main() {
  const [owner, recipient, bidder] = await ethers.getSigners();
  console.log("Deploying to network:", network.name);
  console.log("Deploying from account:", owner.address);

  let geneContract: Contract;
  
  const GeneNFT = await ethers.getContractFactory("GeneNFT");
  geneContract = await GeneNFT.deploy("Cantina", "CTNA", BASE_URI);
  await geneContract.deployed();

  console.log("Mojito NFT Gene contract deployed to:", geneContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
