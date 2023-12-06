const { ethers } = require('ethers');
require('dotenv').config();


async function main() {

  const ABI = [
    'function purchaseTo_do6(address _to, uint256 _projectId) public',
  ];

  const artblocksContract = '0xc4cbC7Cf4068858fE32E36fBbFe857bDEc4C1dEF'; // ArtBlocks Minter Contract Address
  const RECIPIENT = '0x9f2aDEcAd246f1e6DEd6500294Efd365Bdb40896';  // Recepient wallet Address
  const ProjectId = "10"     // Project Id                                   
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
  const Contract = new ethers.Contract(artblocksContract, ABI, wallet);
  
  const MintLimit = 10;      // Total Nfts Need to be minted

  for (let i = 0; i < MintLimit; i++) {

    const tx = await Contract.purchaseTo_do6(RECIPIENT,ProjectId)
  
    console.log(`\n Token Id ${i} minted to wallet ${RECIPIENT}:, tx hash: ${tx.hash}`);
  
    console.log("Waiting for confirmations...");
    const txhash = await tx.wait(1);
  
    console.log(`Confirmed! Gas used: ${txhash.gasUsed.toString()}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


