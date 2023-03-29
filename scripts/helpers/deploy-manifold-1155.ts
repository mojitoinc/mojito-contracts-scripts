  import { ethers } from "hardhat";

async function main() {
  const CREATOR_IMPLEMENTATION_ADDR = await ethers.getContractFactory("ERC1155CreatorImplementation");
  const creator_implement = await CREATOR_IMPLEMENTATION_ADDR.deploy();
  await creator_implement.deployed();
  console.log("Creator_implementation contract deployed to:", creator_implement.address);
  const Creator_implementation = await ethers.getContractFactory("Creator1155Proxy");
  const creator_implementation = await Creator_implementation.deploy("0xd8613ca3bd2b264fae289f74d07de709e14a05e4");
  await creator_implementation.deployed();
  console.log("Creator_implementation contract deployed to:", creator_implementation.address);
 
    
    // const contract = await ethers.getContractAt(
    //   "ERC1155CreatorImplementation",
    //   "0x1f7bc4733b6b6692068b7ce9b59a4c9cd30a8c55");
    //  const receipt1 = await contract["setTokenURI(uint256,string)"](1,"https://gateway.arweave.net/rDiULRmfBwn6GForSfRvAMMheef0fXYcWhtq3_8QwNY");
    //  console.log("Waiting for confirmations...");
    //  const tx1 = await receipt1.wait(1);
    //  console.log(`Confirmed! Gas used: ${tx1.gasUsed.toString()}`);
    //  const receipt2 = await contract["setTokenURI(uint256,string)"](2,"https://gateway.arweave.net/rDiULRmfBwn6GForSfRvAMMheef0fXYcWhtq3_8QwNY");
    //  console.log("Waiting for confirmations...");
    //  const tx2 = await receipt2.wait(1);
    //  console.log(`Confirmed! Gas used: ${tx2.gasUsed.toString()}`);
    //  const receipt3 = await contract["setTokenURI(uint256,string)"](3,"https://gateway.arweave.net/rDiULRmfBwn6GForSfRvAMMheef0fXYcWhtq3_8QwNY");
    //  console.log("Waiting for confirmations...");
    //  const tx3 = await receipt3.wait(1);
    //  console.log(`Confirmed! Gas used: ${tx3.gasUsed.toString()}`);

  //   const receipt4 = await contract["burn(address,uint256[],uint256[])"]("0xe3d32951C8BA72198207c2F36913aFA5ccA39476",[1],[1]);
  //   console.log("Waiting for confirmations...");
  //   const tx4 = await receipt4.wait(1);
  //   console.log(`Confirmed! Gas used: ${tx4.gasUsed.toString()}`);

  //   // const receipt1 = await contract["approveAdmin(address)"]("0xCDdBf591b45B891A14EFc6B0aF916D307383E77F");
  //   // console.log("Waiting for confirmations...");
  //   // const tx1 = await receipt1.wait(1);
  //   // console.log(`Confirmed! Gas used: ${tx1.gasUsed.toString()}`);

  // //   const receipt2 = await contract["mintBaseNew(address[],uint256[],string[])"](
  // //   ["0xCDdBf591b45B891A14EFc6B0aF916D307383E77F"],
  // //   [21000],
  // //   [
  // //     "https://gateway.arweave.net/4pfQOMzcSxmNNBS2f7p1nOzz9EhFdpOXXl7Q58jgrO4"
  // //   ]
  // // );
  // // console.log("Waiting for confirmations...");
  // // const tx2 = await receipt2.wait(1);
  // // console.log(`Confirmed! Gas used: ${tx2.gasUsed.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
