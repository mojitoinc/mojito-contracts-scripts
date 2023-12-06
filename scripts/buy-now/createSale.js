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

  const nftStartTokenId = 0;
  const nftEndTokenId = 0;
  const maxCap = 10; 
  const nftContractAddress = "0x3e9D45aD0da57683b5375d0F3D5BC606429128F9";
  const minimumFiatPrice = 0;
  const minimumCryptoPrice = [ethers.utils.parseUnits("0.1", "ether")];  
  const paymentCurrency = [ethers.constants.AddressZero]; 
  const transactionStatus = 0;
  const paymentStatus = 1;
  const saleId = "1000" ;

                           // payment currenct if eth, address zero, if ERC20, contract address of ERC20 fund
  const paymentSettlementAddress = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8"; // Payment settlement address should not be zero
  const taxSettlementAddress = "0x698C2F5E4b29C90A78eF69DBED39C1c826c99c60"      // Tax Settlement Address
  const commissionAddress = "0x3c65AFAF9115C8B6b6240113713449cf1c67a42A";        // commission Address
  const platformSettlementAddress = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8";// platform Settlement Address
  const CommessionFee = 1000;                                                    // commession fee percentage in basic points
  const platformFee = 1500;                                                      // platform fee percentage in basic points
  const TokenGatingContract = ethers.constants.AddressZero;                      // Required only for token gating set up, currently address zero 
  
  const saleList = [
    nftStartTokenId,
    nftEndTokenId,
    maxCap,
    nftContractAddress,
    minimumFiatPrice,
    minimumCryptoPrice,
    paymentCurrency,
    [paymentSettlementAddress,taxSettlementAddress,commissionAddress,platformSettlementAddress,CommessionFee,platformFee],
    transactionStatus,
    paymentStatus,
    TokenGatingContract
  ];
  

  const buyTx = await Onchainbuy.createOrUpdateSale(saleList,saleId);

  console.log(`\n List the Nft for sale, buyTx hash: ${buyTx.hash}`);
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