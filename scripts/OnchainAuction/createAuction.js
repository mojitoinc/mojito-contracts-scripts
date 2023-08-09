const { ethers } = require('ethers');
const { BigNumber } = require("ethers");
require('dotenv').config();
const AuctionAbi = require('./AuctionAbi.json');

const toTimestamp = (strDate) => {
    const dt = new Date(strDate).getTime();
    return dt / 1000;
};

async function main() {
    // Onchain Auction contract Address     
    const auctionContractAddress = "0x30a32FBA51E2edFdF124c4ff9Bc3824384DB8B1f";

    // Connect to the network using the ABI and the signer 
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
    const Auction = new ethers.Contract(auctionContractAddress, AuctionAbi, wallet);

    const network = await provider.getNetwork();
    const networkName = network.name;
    const chainId = network.chainId;
    let user = wallet.address;

    console.log("NetworkName                       :", networkName);
    console.log("NetworkChainId                    :", chainId);
    console.log("Auction Contract Deployed on      :", Auction.address);
    console.log("Transaction will be executed from :", user);

    const auctionID = "2020"                                                    // DutchAuction ID
    const nft721ContractAddress = "0x3e9D45aD0da57683b5375d0F3D5BC606429128F9"; // Collection contract address
    const tokenId = 0;                                                          // start id, should be zero for mint
    const Quantity1155 = 0;                                                     // quantity should be zero for 721 collection nfts
    const tokenOwnerAddress = "0x3c65AFAF9115C8B6b6240113713449cf1c67a42A";     // Nft token owner address
    const minimumBidCryptoPrice = ethers.utils.parseUnits("0.01", "ether");     // Minimum bid price in WEI
    const ReservedPrice = ethers.utils.parseUnits("0.01", "ether");             // Reserve Price of Nft in WEI
    const paymentCurrency = ethers.constants.AddressZero;                       // payment currenct if eth, address zero, if ERC20, contract address of ERC20 fund
    const whitelistedBuyers = ethers.constants.HashZero;                        // default should be zero
    const blacklistedBuyers = ethers.constants.HashZero;                        // default should be zero

    const AuctionStartTime = toTimestamp("07/26/2023 14:30:00");                 // start Time of the auction should be greater current Time
    const AuctionEndTime = toTimestamp("07/26/2023 16:00:00");                   // End Time should be greater than start Time  

    const paymentSettlementAddress = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8"; // Payment settlement address should not be zero
    const taxSettlementAddress = "0x698C2F5E4b29C90A78eF69DBED39C1c826c99c60"      // Tax Settlement Address
    const commissionAddress = "0x3c65AFAF9115C8B6b6240113713449cf1c67a42A";        // commission Address
    const platformSettlementAddress = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8";// platform Settlement Address
    const CommessionFee = 1000;                                                    // commession fee percentage in basic points
    const platformFee = 1500;                                                      // platform fee percentage in basic points

    console.log("tokenID:", tokenId);
    console.log("minimumBidCryptoPrice:", minimumBidCryptoPrice.toString());
    console.log("ReservedPrice", ReservedPrice.toString());

    console.log("AuctionStartTime:", AuctionStartTime);
    console.log("AuctionEndTime", AuctionEndTime);

    // Auction Details to create the auction
    const AuctionInfo = [
        nft721ContractAddress,
        tokenId,
        Quantity1155,
        tokenOwnerAddress,
        minimumBidCryptoPrice,
        ReservedPrice,
        paymentCurrency,
        whitelistedBuyers,
        blacklistedBuyers,
        [
            paymentSettlementAddress,
            taxSettlementAddress,
            commissionAddress,
            platformSettlementAddress,
            CommessionFee,
            platformFee,
        ]
    ];

    // call to create the auction 
    let receipt = await Auction.createAuction(
        auctionID,
        AuctionInfo,
        AuctionStartTime,
        AuctionEndTime,
        { gasLimit: 500000 }
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
