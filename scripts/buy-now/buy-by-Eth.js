const { ethers } = require('ethers');
require('dotenv').config();
const OnchainBuyAbi = require('./Buynow.json');

async function main() {
 
  // Replace with the actual Onchainbuy contract address
  const OnchainbuyAddress = '0x524ac0F6f9f40801B102C436343e05350cf20439'; 
  
  // Connect to the network using the ABI and the signer 
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
  const Onchainbuy = new ethers.Contract(OnchainbuyAddress, OnchainBuyAbi, wallet);
 
  const network = await provider.getNetwork();
  const networkName = network.name;
  const chainId = network.chainId;
  let user = wallet.address;

  console.log("NetworkName                       :", networkName);
  console.log("NetworkChainId                    :", chainId);
  console.log("OnchainBuy Contract Deployed on   :", Onchainbuy.address);
  console.log("Transaction will be executed from :", user);  

  const saleId = "1000";                                       // pass the sale id of the created sale
  const tokenOwner = ethers.constants.AddressZero;             // pass the token owner address if mint on demand pass zero address
  const tokenId = 0;                                           // pass the id of the nft if mint on demand pass zero 
  const quantity1155 = 0;                                      // pass the quantity of the nft if 1155
  const buyer = "0x3c65AFAF9115C8B6b6240113713449cf1c67a42A";  // pass the address of the buyer
  const quantity = 1;                                          // pass amount of nft to buy if for mint on demand.
  const paymentToken = ethers.constants.AddressZero;           // pass Payment token address,if eth, address zero, if ERC20, contract address of ERC20 fund 
  const price = ethers.utils.parseUnits("0.1", "ether");       // pass the amount(WEI) in to buy the nft 
  const tax = ethers.utils.parseUnits("0", "ether");           // pass the amount if to pay any tax
  const gatedColletion = ethers.constants.AddressZero;         // pass the token gating contract default it is zero
  const gatedTokenId = 0;                                      // pass the token gating token Id for defaule pass zero address
  // pass the data if allowing any discount to buyer
  const discountpercentage = 0                                 // pass the discount percentage if not pass zero
  const expirationTime = 0;                                    // pass the time of expiry in timestamp if not pass zero
  const nonce = "0";                                           // pass the nonce if we have any if not pass it empty
  const signer = ethers.constants.AddressZero;                 // pass the signer address
  const signature = ethers.constants.AddressZero               // pass the signature from admin 
  const buyList = [
    saleId,
    tokenOwner,
    tokenId,
    quantity,
    quantity1155,    
    buyer,
    paymentToken,
    price,
    gatedColletion,
    gatedTokenId
  ];
  const discount = [
    discountpercentage,
    expirationTime,
    nonce,
    signature,
    signer,
  ]
  
  // Call the buy method in onchainBuy Contract.
  const buyTx = await Onchainbuy.buy(buyList, tax, discount, { value: price.add(tax) });

  console.log(`\n buying the Nft, buyTx hash: ${buyTx.hash}`);
  console.log("Waiting for confirmations...");
  const buytxhash = await buyTx.wait(1);
  console.log(
    `Confirmed! Gas used for buying the token: ${buytxhash.gasUsed.toString()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
