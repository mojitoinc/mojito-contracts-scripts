import { ethers, network } from "hardhat";

const EXTENSION_ADDR = "0xD401F096327F4F051Fe5b261D8DE7728E8fdDD4A"; // provenance, rinkeby
const BASE_URI= "http://gateway.arweave.net/SdGIzr81HLOYp79Zpsg1_UWeCFSvhsLs39qr6GXilDE/"
async function main() {
  const [owner] = await ethers.getSigners();

  console.log("Using network:", network.name);
  console.log("Extension contract at:", EXTENSION_ADDR);
  console.log("Owner account:", owner.address);

  const contract = await ethers.getContractAt("ProvenanceExtension", EXTENSION_ADDR);
  const receipt1 = await contract.setBaseURI(BASE_URI);
  console.log("Waiting for confirmations...");
  const tx1 = await receipt1.wait(1);
  console.log(`Confirmed! Gas used: ${tx1.gasUsed.toString()}`);

  // unpause contract
  const receipt2 = await contract.unpauseContract();
  console.log(`\n unpausing extension contract, tx hash: ${receipt1.hash}`);
  console.log("Waiting for confirmations...");
  const tx2 = await receipt1.wait(1);
  console.log(`Confirmed! Gas used: ${tx2.gasUsed.toString()}`);

  
  // Genart
  //const boostToBytes32 = ethers.utils.hexZeroPad(ethers.utils.hexlify(2), 32);
  //const receipt2 = await contract.mint("0x29F00d7868Adac2AFCc29b3E63Ebd8F269bfCCb6", boostToBytes32);

  // mint to address
  // NOTE: must first register extension in creator contract
  const receipt3 = await contract.mintBatch("0x29F00d7868Adac2AFCc29b3E63Ebd8F269bfCCb6", 3);
  console.log(`\n minting, tx hash: ${receipt3.hash}`);
  console.log("Waiting for confirmations...");
  const tx3 = await receipt3.wait(1);
  console.log(`Confirmed! Gas used: ${tx3.gasUsed.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.error);
    process.exit(1);
  });