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
   
    // const Implementation = await ethers.getContractFactory("ERC1155CreatorImplementation");
    // implementationContract = await Implementation.deploy();
    // await implementationContract.deployed();
    // console.log("implementationContract address",implementationContract.address);
    // const Creator = await ethers.getContractFactory("Creator1155Proxy");
    // creatorContract = await Creator.deploy(implementationContract.address);
    // await creatorContract.deployed();
    // console.log("creatorContract address",creatorContract.address);
    // get proxy contract (implementation abi + creator address)
    creatorContract = await ethers.getContractAt("ERC1155CreatorImplementation","0x688c0e1e669e693b8c16acf64832d6ea3cddfb0b");
    //creatorContract = await ethers.getContractAt("ERC1155CreatorImplementation",creatorContract.address);
    const Extension = await ethers.getContractFactory("ProvenanceExtension1155");
    // Extension contract sets the creator contract address in the constructor
    extensionContract = await Extension.deploy(creatorContract.address, 20, 5);
    await extensionContract.deployed();
    console.log("extensionContract:",extensionContract.address);
    const BASE_URI = "ar://placeholder/";     
    const Txhash = await creatorContract["registerExtension(address,string)"](extensionContract.address, BASE_URI);
    console.log("Txhash:",Txhash.hash);

    /*await extensionContract.mintBatch(user.address,1,0);
    await extensionContract.mintBatch(user.address,2,0);
    await extensionContract.mintBatch(user.address,3,0);
    await extensionContract.mintBatch(user.address,4,0);
    await extensionContract.mintBatch(user.address,5,0);
    await extensionContract.mintBatch(user.address,5,0);
    await extensionContract.mintBatch(user.address,4,1);
    await extensionContract.mintBatch(user.address,,2);*/


    /*const ExtensionContract = await ethers.getContractFactory("ProvenanceExtension1155");
    extensionContract = await ExtensionContract.attach("0x547b183acb527234d9c21f68cab83ed65069b408");
     
    const vikramaddress ="0x2C813FeF41C05ab02DC898cbdDD4045db4705c8E";

    //await extensionContract.approveAdmin(vikramaddress);
    console.log(await extensionContract.isAdmin(vikramaddress));*/
} 

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.error);
    process.exit(1);
  });