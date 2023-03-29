import { ethers } from "hardhat";

async function main() {
  const contract_address = "0x7d55c69290411a6d194Db86E21dCa07aaFc24C8d";
  
  const contract = await ethers.getContractAt(
    "ERC1155CreatorImplementation",
    contract_address
  );

  const receipt3 = await contract["registerExtension(address,string)"](
    '0x16E072D3b15E9586bf015202EE782210b916cdb4',
    'https://gateway.arweave.net/Obhqwa5j6vnF6ggGEXa66ent2RU_SZAz-p8_Xw8w6Qo/'
  );
  console.log("Waiting for confirmations...");
  const tx3 = await receipt3.wait(1);
  console.log(`Confirmed! Gas used: ${tx3.gasUsed.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });