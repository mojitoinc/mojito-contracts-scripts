import { run, ethers, network } from "hardhat";
import { Contract } from "ethers";

const CREATOR_ADDR = "0xC9c297d481C074c3d4AcB2B6a3d177Bb60eD51Ad";

async function logReceipt(receipt: any) {
  console.log(`tx hash: ${receipt.hash}, waiting for confirmations...`);
  const tx = await receipt.wait(1);
  console.log(`Gas used: ${tx.gasUsed.toString()}`);
}

async function main() {
  const [owner, recipient, bidder] = await ethers.getSigners();
  console.log("Deploying to network:", network.name);
  console.log("Deploying from account:", owner.address);

  let extensionContract: Contract;
  
  const Extension = await ethers.getContractFactory("GenartExtension");
  extensionContract = await Extension.deploy(CREATOR_ADDR);
  await extensionContract.deployed();

  console.log("Extension contract deployed to:", extensionContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
