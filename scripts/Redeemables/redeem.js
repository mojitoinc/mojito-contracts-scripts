const { ethers } = require('ethers');
require('dotenv').config();
const RedeemableAbi = require('./RedeemableAbi.json');

async function main() {

  // Replace with the actual Redeemable contract address
  const RedeemableAddress = '0x9a0555452c9e7129Af0bba1768EfD708741a107d';

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
 
  const expirationTime = 1689445810;                                               // TimeStamp Value
  const nonce = 12;                                                                // Nonce infomation 
  const signature = "0x31957e90f3eb784a8b38a19aea3fe346ee435dc999f4652042b8ab376ea791712c779224a39c9557be0d5e3ccfd116c3c182dac89b0580903250f9fc7512e6351b" // Admin Signature 
  const signer = "0xe3d32951C8BA72198207c2F36913aFA5ccA39476";                     // The signer Address

  // Call to Redeem the NFT
  const Tx = await Redeemable.redeem(
    redeemCollectionAddress,
    tokenId,
    claimer,
    quantity,
    tokenURI,
    [expirationTime,nonce,signature,signer]
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