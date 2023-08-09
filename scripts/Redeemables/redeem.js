const { ethers } = require('ethers');
require('dotenv').config();
const RedeemableAbi = require('./RedeemableAbi.json');

async function main() {

  // Replace with the actual Redeemable contract address
  const RedeemableAddress = '0xc830E706eABBd9A4F2F7Ed309E5B519a3073d5f2';

  // Connect to the network using the ABI and the signer 
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
  const Redeemable = new ethers.Contract(RedeemableAddress, RedeemableAbi, wallet);

  const network = await provider.getNetwork();
  const networkName = network.name;
  const chainId = network.chainId;
  let user = wallet.address;

  console.log("NetworkName                       :", networkName);
  console.log("NetworkChainId                    :", chainId);
  console.log("Redeemable Contract Deployed on   :", Redeemable.address);
  console.log("Transaction will be executed from :", user);


  const redeemCollectionAddress = "0x3e9D45aD0da57683b5375d0F3D5BC606429128F9";    // Pass the Redeem Collection Address
  const tokenId = 2;                                                               // Pass the TokenId to redeem 
  const claimer = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8";                    // Pass claimer wallet address 
  const quantity = 0;                                                              // Pass quanity if ERC1155
  const tokenURI = ""                                                              // Pass Uri to set in claimable token

  // Call to Redeem the NFT
  const Tx = await Redeemable.redeem(
    redeemCollectionAddress,
    tokenId,
    claimer,
    quantity,
    tokenURI
  );

  console.log(`\n transaction hash of redeem: ${Tx.hash}`);
  console.log("Waiting for confirmations...");
  const txhash = await Tx.wait(1);
  console.log(
    `Confirmed! Gas used for buying the token: ${txhash.gasUsed.toString()}`
  );


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });