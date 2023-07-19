import { ethers } from "hardhat";
import { BigNumber} from "ethers";
import hre from 'hardhat'
async function main() {
    const accounts = await ethers.getSigners();
    const networkName = hre.network.name
    const chainId = hre.network.config.chainId
    let user = accounts[0];
    let OnchainBuyContractAddress = "0x524ac0F6f9f40801B102C436343e05350cf20439"; // pass the onchain buy contract address

    const Onchainbuy = await ethers.getContractAt("OnchainBuyV1_1",OnchainBuyContractAddress);
    console.log("networkName =",networkName );
    console.log("networkChainId =",chainId );
    console.log(`onchain buy contract address: ${Onchainbuy.address}`);
    console.log("transaction will be executed from",user.address)

    const saleId = ""; // pass the sale id of the created sale
    const tokenOwner = ""; // pass the token owner address // if mint on demand pass zero address
    const tokenId = 0; // pass the id of the nft
    const quantity1155 = 0; // pass the quantity of the nft if 1155
    const buyer = ""; // pass the address of the buyer
    const quantity = 1; // pass amount of nft to buy if for mint on demand.
    const paymentToken = ethers.constants.AddressZero;
    const price = ethers.utils.parseUnits("0", "ether") as BigNumber; // pass the amount(WEI) in to buy the nft 
    const tax = ethers.utils.parseUnits("0", "ether") as BigNumber; // pass the amount if to pay any tax

    // pass the data if allowing any discount to buyer
    const discountpercentage = 0 // pass the discount percentage if not pass zero
    const expirationTime = 0; // pass the time of expiry in timestamp if not pass zero
    const nonce = ""; // pass the nonce if we have any if not pass it empty
    const signer = ethers.constants.AddressZero;
    const signature = ethers.constants.AddressZero
  const buyList = [
    saleId,
    tokenOwner,
    tokenId,
    quantity1155,
    quantity,
    buyer,
    paymentToken,
    price,
  ];
  const discount =[
    discountpercentage,
    expirationTime,
    nonce,
    signature,
    signer,
  ]

  const buyTx = await Onchainbuy.buy(buyList,tax,discount, { value: price.add(tax)});

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