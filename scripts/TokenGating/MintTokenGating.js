
const { ethers } = require('ethers');
require('dotenv').config();
const TokenGatingAbi = require('./TokenGatingAbi.json');


async function main() {

const TokenGatingAddress = "0x5DFd556d517C50FA38E232Ab6F5B86744C440D6f";


// Connect to the network using the ABI and the signer 
const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
const TokenGating = new ethers.Contract(TokenGatingAddress, TokenGatingAbi, wallet);

const network = await provider.getNetwork();
const networkName = network.name;
const chainId = network.chainId;
let user = wallet.address;

console.log("NetworkName                       :", networkName);
console.log("NetworkChainId                    :", chainId);
console.log("Redeemable Contract Deployed on   :", TokenGating.address);
console.log("Transaction will be executed from :", user);
  
  const gatedContractAddress = "0xf22403295Eb7988F755afc5Cc607b7c7d84eaEc0" // pass the gated nft contract address
  const gatedTokenId =   1                                                  // pass the gated token id from the contract address gated
  const walletAddress = "0x47275b76aa368DAbD54966E0D33573C10b4E320B"        // pass the owner wallet address the nft gated
  const mintCollectionAddress="0x4aae402A09C5D0eD7Eada437Def114D446aF429B"  // pass the claim collection address
  const tokenIdExt1155 = 0                                                  // pass the quantity if only for 1155 collection else pass 0(zero)
  // this is for admin approval flow currently zero for everything.
  const approvalData = [
    0,
    '0',
    ethers.constants.AddressZero,
    ethers.constants.AddressZero,
  ];
  const limit = await TokenGating.getCollectionTokenLimit(gatedContractAddress,gatedTokenId, walletAddress);

    // Check if the limit is zero and throw an error if it is
    if (limit = 0) {
        throw new Error(`Token limit for gated contract ${gatedContractAddress}, token ID ${gatedTokenId}, and wallet ${walletAddress} is zero.`);
      }
    
  // call to mint the nft
  const tx = await TokenGating.mint(gatedContractAddress,gatedTokenId,walletAddress,mintCollectionAddress,tokenIdExt1155,approvalData);

  console.log(`\n transaction executed in blockchain, tx hash: ${tx.hash}`);

  console.log("Waiting for confirmations...");
  const txhash = await tx.wait(1);

  console.log(`Confirmed! Gas used: ${txhash.gasUsed.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.error);
    process.exit(1);
  });
