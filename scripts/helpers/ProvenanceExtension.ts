import { ethers } from "hardhat";
import { BigNumber, Bytes, Contract, Signer } from "ethers";

  let implementationContract: Contract;
  let creatorContract: Contract;
  let extensionContract: Contract;
  let proxyContract: Contract;
  let id : Bytes;
async function main() {
  
    const accounts = await ethers.getSigners();
    const user = accounts[0];
    console.log("owner address",user.address);

    // const Implementation = await ethers.getContractFactory("ERC721CreatorImplementation");
    // implementationContract = await Implementation.deploy();
    // await implementationContract.deployed();

    // console.log("implementationContract address",implementationContract.address);
  
    // const Creator721Proxy = await ethers.getContractFactory("Creator721Proxy");
    // creatorContract = await Creator721Proxy.deploy(
    //   "Test Token",
    //   "TT",
    //   implementationContract.address
    // );
    // await creatorContract.deployed();

    // console.log("creatorContract address",creatorContract.address);

    // get proxy contract (implementation abi + creator address)
    creatorContract = await ethers.getContractAt("ERC721CreatorImplementation","0x688c0e1e669e693b8c16acf64832d6ea3cddfb0b");
   // creatorContract = await ethers.getContractAt("ERC721CreatorImplementation",creatorContract.address);
    const Extension = await ethers.getContractFactory("ProvenanceExtension");
    // Extension contract sets the creator contract address in the constructor
    extensionContract = await Extension.deploy(creatorContract.address, 20);
    await extensionContract.deployed();
    console.log("extensionContract:",extensionContract.address);
    const BASE_URI = "ar://placeholder/";     
   const Txhash = await creatorContract["registerExtension(address,string)"](extensionContract.address, BASE_URI);
   console.log("Txhash:",Txhash.hash);

  
} 

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.error);
    process.exit(1);
  });