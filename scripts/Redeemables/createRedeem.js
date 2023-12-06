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


  // Place the Inputs for creating the redeemables
  const redeemCollectionAddress = "0x3e9D45aD0da57683b5375d0F3D5BC606429128F9";    // Pass the Redeem Collection Address
  const newCollectionAddress = "0x109D380EB232C07d989A8339345256426e33629F";       // Pass the Claim Collection Address
  const tokenHoldingAddress = "0x3c65AFAF9115C8B6b6240113713449cf1c67a42A";        // Pass Token holder wallet address 
  const mintLimit = 10;                                                            // Pass Mint Limit
  const maxEndRandge = 0;                                                          // Pass MaxID Range. default should be zero
  const extensionBaseUri = true                                                    // Pass True ot false for extensionBaseUri
  const clientName = "Mojito"                                                      // CLient name in string type


  const List = [
    newCollectionAddress,
    tokenHoldingAddress,
    mintLimit,
    maxEndRandge,
    extensionBaseUri,
    clientName
  ];

  // Call for Create the redeem with list
  const Tx = await Redeemable.createorUpdateRedeem(redeemCollectionAddress, List);

  console.log(`\n transaction hash of createorUpdateRedeem: ${Tx.hash}`);
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