import { ethers } from "hardhat";
import { BigNumber, Bytes, Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import web3 from "web3";
import { addresses } from "@zoralabs/zdk";
const bytes32 = require('bytes32');

let extensionContract: Contract;
let signer : SignerWithAddress;
let redeemer : SignerWithAddress;

async function main() {
  const account = await ethers.getSigners();
  signer = account[0];
  
 
  const ExtensionContract = await ethers.getContractFactory("ProvenanceExtension1155");
  extensionContract = await ExtensionContract.attach("0x707BE96084c420052EAF6867DCFe7eca919f5Bcb");
  const redeemer = account[1];
  const amounts = 1;
  const tokenid = -1 ; //If mintNew tokenid is -1;
  await extensionContract.mintBatch(redeemer,amounts,tokenid);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });