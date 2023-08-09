const { ethers } = require('ethers');
require('dotenv').config();
const DutchContractAbi = require('./DutchAuctionAbi.json');
const DutchUtilityAbi = require('./DutchUtilityAbi.json');

/************ Sample Data for buy()******************************
 
auctionId : "88e0d944-04ab-4ed3-9f8b-c6d2023fd6af"
buyingAmount : 10000000000000000
tax: 0
totalBuytoken : 1
quantity : 0
BlacklistProof : [0x0000000000000000000000000000000000000000000000000000000000000000]  
discountPercentage :0
expirationTime :1689445810
nonce :12
signature :0x31957e90f3eb784a8b38a19aea3fe346ee435dc999f4652042b8ab376ea791712c779224a39c9557be0d5e3ccfd116c3c182dac89b0580903250f9fc7512e6351b
signer:0xe3d32951C8BA72198207c2F36913aFA5ccA39476 
*/

async function main() {
  
  // Dutch Auction contract Address     
  const auctionContractAddress = "0x30a32FBA51E2edFdF124c4ff9Bc3824384DB8B1f";
  // Dutch Utility contract Address 
  const auctionUtilityAddress = "0xa830628c31D3647a73585eECD7008cdb7C97d994";    
  
  // Connect to the network using the ABI and the signer 
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
  const Auction = new ethers.Contract(auctionContractAddress, DutchContractAbi, wallet);
  const AuctionUtility = new ethers.Contract(auctionUtilityAddress, DutchUtilityAbi, wallet);

  const network = await provider.getNetwork();
  const networkName = network.name;
  const chainId = network.chainId;
  let user = wallet.address;

  console.log("NetworkName                       :", networkName);
  console.log("NetworkChainId                    :", chainId);
  console.log("Auction Contract Deployed on      :", Auction.address);
  console.log("Transaction will be executed from :", user);


  const auctionId = "2020";                                                   // Auction Id

  // getting the current dutch auction price
  const currentPrice = await AuctionUtility.getCurrentDutchPrice(auctionId);

  const totalBuytoken = 2;                                                    // token count to buy    
  const buyingAmount = currentPrice.mul(totalBuytoken);                       // calcualted Buying amount based on current price and no of tokens
  const tax = 0;                                                              // tax of buying Amount.
  const quantity = 0;                                                         // Quantity should be zero for ERC721
  const BlacklistProof = ethers.constants.HashZero;                           // default should be zero
  const discountPercentage = 0;                                               // Default should be zero
  const expirationTime = 1689445810;                                          // TimeStamp Value
  const nonce = 12;                                                           // Nonce infomation 
  const signature = "0x31957e90f3eb784a8b38a19aea3fe346ee435dc999f4652042b8ab376ea791712c779224a39c9557be0d5e3ccfd116c3c182dac89b0580903250f9fc7512e6351b" // Admin Signature 
  const signer = "0xe3d32951C8BA72198207c2F36913aFA5ccA39476";                 // The signer Address

  console.log("Current Price", currentPrice.toString())
  console.log("BuyAmount", buyingAmount.toString());

  // call to buy the token(s)
  let receipt = await Auction.buy(
    auctionId,
    buyingAmount,
    tax,
    totalBuytoken,
    quantity,
    [BlacklistProof],    
    [discountPercentage, expirationTime, nonce, signature, signer],
    { value: buyingAmount.add(tax) }
  );

  console.log(`\n transaction hash of buy, tx hash: ${receipt.hash}`);
  console.log("Waiting for confirmations...");
  const tx = await receipt.wait(1);
  console.log(`Confirmed! Gas used: ${tx.gasUsed.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



