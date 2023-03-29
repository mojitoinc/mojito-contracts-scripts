  import { ethers } from "hardhat";
 
async function main() {
const BASE_URI= "ipfs://QmfMjHRSDP415gmMS9g7h8BMNys4yr9ZgVM8wAtxoBxaCY/"
// // // const CREATOR_IMPLEMENTATION_ADDR = "0x145B93C98a4A9036b9D92125f8543DC4650382e9";  //Mumbai Polygon
const Creator = await ethers.getContractFactory("Creator721Proxy");
const creatorContract = await Creator.deploy("NEW TOKENS REDEEM", "REDE", "0x3482612ee7A70dbc40d364f074a5b5EA57ba8847");
await creatorContract.deployed();

console.log("Creator contract deployed to:", creatorContract.address);
const contract = await ethers.getContractAt("ERC721CreatorImplementation",creatorContract.address);
const receipt1 = await contract["setBaseTokenURI(string)"](BASE_URI);
console.log("Waiting for confirmations...");
const tx1 = await receipt1.wait(1);
console.log(`Confirmed! Gas used: ${tx1.gasUsed.toString()}`);
// const approveForAllTx1 = await contract.setApprovalForAll("0xE765F9E4cCFAe71dD512ba9ac0F61694713d806e", true);
// // const receipt2 = await contract["setTokenURI(uint256,string)"](73,"https://gateway.arweave.net/f4SlgzExuJfm-fEDwzEKIYxxHDY-XFkiWCqL3IiET_U");
// const receipt = await contract["registerExtension(address,string)"]("0xE765F9E4cCFAe71dD512ba9ac0F61694713d806e", BASE_URI);
// console.log("Waiting for confirmations...");
// const tx2 = await receipt.wait(1);
// console.log(`Confirmed! Gas used: ${tx2.gasUsed.toString()}`);
// // const receipt2 = await contract["approveAdmin(address)"]("0x1E7AF0Df5900490d5F535dBA0180A8ABFCd6Dc40");
// console.log("Waiting for confirmations...");
// const tx2 = await approveForAllTx1.wait(1);
// console.log(`Confirmed! Gas used: ${tx2.gasUsed.toString()}`);

const receipt2 = await contract["mintBaseBatch(address,uint16)"]("0xC7e893488A039A341d935959E52f86085976F865",5);
console.log("Waiting for confirmations...");
const tx2 = await receipt2.wait(1);
console.log(`Confirmed! Gas used: ${tx2.gasUsed.toString()}`);
// const receipt3 = await contract["mintBaseBatch(address,uint16)"]("0xC7e893488A039A341d935959E52f86085976F865",5);
// console.log("Waiting for confirmations...");
// const tx3 = await receipt3.wait(1);
// console.log(`Confirmed! Gas used: ${tx3.gasUsed.toString()}`);
// const receipt4 = await contract["mintBaseBatch(address,uint16)"]("0xF16A27e70C878100B2f22AC8F21c436154FE3817",5);
// console.log("Waiting for confirmations...");
// const tx4 = await receipt4.wait(1);
// console.log(`Confirmed! Gas used: ${tx4.gasUsed.toString()}`);
// const receipt5 = await contract["mintBaseBatch(address,uint16)"]("0xb7eF4924EB568842EfC04ed147478d5dE602A7cb",5);
// console.log("Waiting for confirmations...");
// const tx5 = await receipt5.wait(1);
// console.log(`Confirmed! Gas used: ${tx5.gasUsed.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });