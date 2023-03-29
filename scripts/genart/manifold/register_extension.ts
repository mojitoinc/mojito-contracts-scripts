import { ethers, network } from "hardhat";

const EXTENSION_ADDR = "0xD401F096327F4F051Fe5b261D8DE7728E8fdDD4A"; // Genart or Provenance Extensions
const MAIN_ADDR = "0x58fe7856C28Eba9A0025781A3Db23Cc82f22368D"; // main.sol
const CREATOR_IMPLEMENTATION_ADDR = "0x00609bEcC7d64CecfAadF8a7B02AA3a9B12c30a4"

const BASE_URI = "ar://placeholder/";

async function main() {
  const [owner] = await ethers.getSigners();

  console.log("Using network:", network.name);
  console.log("Main contract at:", CREATOR_IMPLEMENTATION_ADDR);
  console.log("Owner account:", owner.address);

  // register extension
  // use implementation ABI with creator/proxy address
  const contract = await ethers.getContractAt("ERC721CreatorImplementation", CREATOR_IMPLEMENTATION_ADDR);

  const name = await contract.name();
  console.log("name: ", name)

  const receipt = await contract["registerExtension(address,string)"](EXTENSION_ADDR, BASE_URI);
  console.log(`\n registering ${EXTENSION_ADDR} as extension contract, tx hash: ${receipt.hash}`);
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