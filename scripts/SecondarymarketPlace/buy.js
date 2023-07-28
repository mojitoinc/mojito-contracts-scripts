const { ethers } = require('ethers');
require('dotenv').config();
const MarketPlaceAbi = require('./MarketPlaceAbi.json');

async function main() {

    // Secondary MarketPlace contract Address     
    const marketPlaceContractAddress = "0x2BAefd2ef0557d8E0fB9463d30651F59EE58d6c0";

    // Connect to the network using the ABI and the signer 
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
    const MarketPlace = new ethers.Contract(marketPlaceContractAddress, MarketPlaceAbi, wallet);

    const network = await provider.getNetwork();
    const networkName = network.name;
    const chainId = network.chainId;
    let user = wallet.address;

    console.log("NetworkName                          :", networkName);
    console.log("NetworkChainId                       :", chainId);
    console.log("MarketPlace Contract Deployed on     :", MarketPlace.address);
    console.log("Transaction will be executed from    :", user);


    // Place the Order details
    const uuid = "2010";                                                 // Pass generated Unique uuid
    const tokenId = 2;                                                   // Pass NFT tokenId
    const tokenContract = "0x3e9D45aD0da57683b5375d0F3D5BC606429128F9";  // Pass the NFT Contract address
    const quantity = 1;                                                  // Pass total quantity of the ERC1155 token if ERC721 it is 1
    const tokenOwner = "0x3c65AFAF9115C8B6b6240113713449cf1c67a42A";     // Pass the address of the Token Owner
    const fixedPrice = ethers.utils.parseUnits("0.1", "ether");          // Pass fixedPrice Price fixed by the TokenOwner
    const paymentToken = "0x54FA517F05e11Ffa87f4b22AE87d91Cec0C2D7E1";                   // Pass paymentToken ERC20 address chosen by TokenOwner for Payments
    const tax = ethers.utils.parseUnits("0", "ether");;                                  // Pass the tax value.
    const paymentSettlementAddress = "0xacd73aBb13630a142aD44d8f75fB7c0309fe80e8";       // Pass the payment Settlement Address.
    const buyer = "0x698C2F5E4b29C90A78eF69DBED39C1c826c99c60";                          // pass the buyer address

    // Place the seller signature
    const sellerSignature = "0x6ceaf723880f328fcf6b8d08ec74e0745225119cef85b499c449e1ed9f3992a6432bd1c558c7c1f9b206361e3755fd5aeeb2f498c058592dc02fd857a8d177131c";
    // Place the Payable token contract address
    const payableToken = "0x54FA517F05e11Ffa87f4b22AE87d91Cec0C2D7E1";
    // Place the signer address
    const signer = "0x698C2F5E4b29C90A78eF69DBED39C1c826c99c60";

    const Order = [
        uuid,
        tokenId,
        tokenContract,
        quantity,
        tokenOwner,
        fixedPrice,
        paymentToken,
        tax,
        paymentSettlementAddress,
        buyer
    ];

    // call to buy the token(s)
    let receipt = await MarketPlace.buy(
        Order,
        sellerSignature,
        payableToken,
        signer
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