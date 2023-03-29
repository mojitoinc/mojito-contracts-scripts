import { ethers } from "hardhat";
import { BigNumber, Bytes, Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import web3 from "web3";
const bytes32 = require('bytes32');

let extensionContract: Contract;
let signer : SignerWithAddress;
let redeemer : SignerWithAddress;


async function main() {
  const account = await ethers.getSigners();
  signer = account[0];
  redeemer = account[1];

    const ExtensionContract = await ethers.getContractFactory("ProvenanceExtension1155");
  extensionContract = await ExtensionContract.attach("0x707BE96084c420052EAF6867DCFe7eca919f5Bcb");
  
  let id;
  id = bytes32({input:"1001"});
  console.log(id);
  const signParam = [
      id,
      redeemer.address,
      1,
      -1,
      extensionContract.address
 ];
 const abi = ethers.utils.defaultAbiCoder;
 const hashedMessage = ethers.utils.solidityKeccak256(
    ["bytes"],
    [
    abi.encode(
        [
          "bytes32",
          "address",
          "uint256",
          "int256",
          "address"
        ],
        signParam
      ),
    ]
  );
 
 const signature = await signer.signMessage(ethers.utils.arrayify(hashedMessage));
 console.log("recover(out):",ethers.utils.verifyMessage(ethers.utils.arrayify(hashedMessage), signature));
 const order = [
    id,
    redeemer.address,
    1,
    -1,
    signature          
];
//console.log(hashedMessage);
//console.log(await extensionContract.getVoucherDigest(order));
//console.log(await extensionContract.getVoucherSigner(order));
await extensionContract.redeem(order);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

