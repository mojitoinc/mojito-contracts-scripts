const { ethers } = require('ethers');
require('dotenv').config();
const OnchainClaimAbi = require('./provinance-claim.json');

async function main() {
  // Replace with the actual Onchainbuy contract address
  const claimContract = '0x524ac0F6f9f40801B102C436343e05350cf20439'; 
  
  // Connect to the network using the ABI and the signer 
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
  const Onchainbuy = new ethers.Contract(claimContract, OnchainClaimAbi, wallet);
 
  const network = await provider.getNetwork();
  const networkName = network.name;
  const chainId = network.chainId;
  let user = wallet.address;

  console.log("NetworkName                       :", networkName);
  console.log("NetworkChainId                    :", chainId);
  console.log("OnchainBuy Contract Deployed on   :", OnchainClaimAbi.address);
  console.log("Transaction will be executed from :", user);  

  const extension = '0xE1fcFD3197F968b7bc8Af045d67428f900Cf7034'; // nft contract address
  const tokenUri =
    'https://live---tim-ferriss-metadata-fc7dztaqfa-uw.a.run.app/metadata/1'; // nft token uri if not pass empty string
  const id = '12345';                                               // sale Id
  const claimeraddress = claimer.address;                           // users address to get the nft
  const expiryTime = "1703055756"                                   // expiration time
  const signature = sellerSignature;                                // signature data

  const tx = await Provinance.connect(claimer).claim([
    id,
    extension,
    tokenUri,
    claimeraddress,
    expiryTime,
    signature
  ]);

  console.log(`\n adding Base token URI, tx hash: ${tx.hash}`);

  console.log('Waiting for confirmations...');
  const txhash = await tx.wait(1);

  console.log(`Confirmed! Gas used: ${txhash.gasUsed.toString()}`);
}