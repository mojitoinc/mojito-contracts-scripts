import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";

const toTimestamp = (strDate: string | number | Date) => {
  const dt = new Date(strDate).getTime();
  return dt / 1000;
};

const AddressZero = "0x0000000000000000000000000000000000000000";

async function main() {
  const accounts = await ethers.getSigners();
  const owner = accounts[0];
  console.log("Using network:", network.name);
  console.log("Owner account:", owner.address);

  const nft721ContractAddress = "0x3e9D45aD0da57683b5375d0F3D5BC606429128F9"; // Collection contract address
  const isMint = true;                              // default is true for above sample contract
  const tokenStartId = 0;                           // start id, should be zero for mint
  const tokenEndId = 0;                             // end id, should be zero for mint
  const Quantity1155 = 0;                           // quantity should be zero for 721 collection nfts
  const tokenOwnerAddress = AddressZero  ;          // If mint type,should be zero Address, else nft token owner address
  const noOfTokens = 8;                            // should be the number of tokens to be minted
  const walletLimit = 4;                            // should be mimimum walletlimit as 1
  const transactionLimit = 2;                       // should be minimum walletlimit as 1
  const isInstantDelivery = true;                   // default is true for current nft delivery
  const isRebate = true;                            // default is true for rebate specific
  const isSignerRequied = false                      // default is true. In this Case,Admin signature required to buy the NFT
  /*
    saletype
    0 - erc_721_nft_type
    1 - erc_1155_single_tokens_multiple_quantity 
    2 - erc_1155_multiple_tokens_with_same_quantity
    */
  const saleType = 0;                                // default should be 0 for default
  const BlacklistedRoot = ethers.constants.HashZero; // default should be zero
  const StartingPrice = ethers.utils.parseUnits("0.1", "ether") as BigNumber;   // any value in eth
  const reservedPrice = ethers.utils.parseUnits("0.001", "ether") as BigNumber; // any value in eth should be less than start price
  const reducedPrice = ethers.utils.parseUnits("0.001", "ether") as BigNumber;  // any value in eth below start price
  const AuctionStartTime = toTimestamp("07/15/2023 03:29:00");                  // start Time of the auction should be greater current Time
  const AuctionEndTime = toTimestamp("07/16/2023 24:00:00");                    // End Time should be greater than start Time  
  const reducedTime = 900;                                                     // Time interval for price reduce in secends
  const halfLifeTime = toTimestamp("07/16/2023 24:00:00");                      // half life time value

  console.log("AuctionStartTime:", AuctionStartTime);       
  console.log("AuctionEndTime",AuctionEndTime);
  console.log("halfLifeTime",halfLifeTime);

  
  const paymentCurrency = ethers.constants.AddressZero;                          // payment currenct if eth, address zero, if ERC20, contract address of ERC20 fund
  const paymentSettlementAddress = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8"; // Payment settlement address should not be zero
  const taxSettlementAddress = "0x698C2F5E4b29C90A78eF69DBED39C1c826c99c60"      // Tax Settlement Address
  const commissionAddress = "0x3c65AFAF9115C8B6b6240113713449cf1c67a42A";        // commission Address
  const platformSettlementAddress = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8";// platform Settlement Address
  const CommessionFee = 1000;                                                    // commession fee percentage in basic points
  const platformFee = 1500;                                                      // platform fee percentage in basic points

  const AuctionContractAddress = "0x30a32FBA51E2edFdF124c4ff9Bc3824384DB8B1f";   // Dutch Auction contract Address
  
  // getting the reference of the deployed Dutch Auction Contract
  const Auction = await ethers.getContractAt(
    "DutchAuction",
    AuctionContractAddress
  );

  console.log("Auction Contract Deployed on :", Auction.address);

  // Nft Details to create the auction
  const nftInfo = [
    nft721ContractAddress,
    tokenStartId,
    tokenEndId,
    Quantity1155,
    tokenOwnerAddress,
    noOfTokens,
    walletLimit,
    transactionLimit,
    isMint,
    isInstantDelivery,
    isRebate,
    isSignerRequied,
    saleType,
    BlacklistedRoot,
  ];

  // Auction Details to create the auction
  const bidInfo = [
    nftInfo,
    StartingPrice,
    reservedPrice,
    reducedPrice,
    AuctionStartTime,
    AuctionEndTime,
    reducedTime,
    halfLifeTime,
    paymentCurrency,
    [
      paymentSettlementAddress,
      taxSettlementAddress,
      commissionAddress,
      platformSettlementAddress,
      CommessionFee,
      platformFee,
    ],
  ];  

  // call to create the dutch auction 
  let receipt = await Auction.createOrUpdateDutchAuction(
    "2000",
    bidInfo,
    {gasLimit: 500000}
  );
  console.log(`\n transaction hash of created sale, tx hash: ${receipt.hash}`);
  console.log("Waiting for confirmations...");
  const tx = await receipt.wait(1);
  console.log(`Confirmed! Gas used: ${tx.gasUsed.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.error);
    process.exit(1);
  });
