import { ethers, network } from "hardhat";

const CREATOR_IMPLEMENTATION_ADDR = "0x00609bEcC7d64CecfAadF8a7B02AA3a9B12c30a4"; // rinkeby

async function main() {
  const [owner] = await ethers.getSigners();

  console.log("Using network:", network.name);
  console.log("Creator Implementation contract at:", CREATOR_IMPLEMENTATION_ADDR);
  console.log("Owner account:", owner.address);

  const contract = await ethers.getContractAt("ERC721CreatorImplementation", CREATOR_IMPLEMENTATION_ADDR);

  // register extension
  const receipt = await contract.initialize("Testing Tokens", "TESTT");
  console.log(`\n initializing new name and symbol, tx hash: ${receipt.hash}`);
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