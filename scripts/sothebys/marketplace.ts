import { ethers } from "hardhat";
import { BigNumber, utils } from "ethers";

async function main() {
  const accounts = await ethers.getSigners();
  const seller = accounts[0];
  const buyer = accounts[3];
  const nftAddress = "0x10554262956614c3D49b19e22E00684cb62126cC";
  const wethAddress = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
  const platformAddress = "0x0000000000000000000000000000000000000000";
  const platformFee = 0;
  const priceFeedAddress = "0xe306C1DcCB13e9dB2af5C782ab2e36416C21B43e";

  const buy = await ethers.getContractAt("Marketplace","0xd2586484A08E0eD0Bd265c90250278ef62C5c2A8");
  console.log(`Buy Contract deployed to: ${buy.address}`);
  console.log(`seller address: ${seller.address}`);
  console.log(`buyer address: ${buyer.address}`);

  // Approving functionality from ERC721 Contract to Marketplace Contract
  const nftMedia = await ethers.getContractAt(
    "ERC721CreatorImplementation",
    nftAddress
  );

  const approveForAllTx = await nftMedia
    .connect(seller)
    .setApprovalForAll(buy.address, true);
  console.log(`Approve transaction submitted to: ${approveForAllTx.hash}`);
  await approveForAllTx.wait(1);

  // Order Parameters
  const fixedPrice = utils.parseEther("0.000005");
  const tax = utils.parseEther("0.0000001");
  const uuid = "024a81a0-62ff-444b-8772-a0b32aee2dfc";
  const order = [
    uuid,
    1,
    nftAddress,
    BigNumber.from("1"),
    seller.address,
    fixedPrice,
    wethAddress,
    tax,
    ethers.constants.AddressZero,
    0,
    0,
    buyer.address,
  ];

  const param = order.slice(0, 7);
  console.log(param);
  const hashedMessage = ethers.utils.solidityKeccak256(
    ["bytes"],
    [
      ethers.utils.solidityPack(
        [
          "string",
          "uint256",
          "address",
          "uint256",
          "address",
          "uint256",
          "address",
        ],
        param
      ),
    ]
  );

  // //Seller Signature is generated by signing the hash generated
  const sellerSignature = await seller.signMessage(
    ethers.utils.arrayify(hashedMessage)
  );
  console.log(sellerSignature);

  // Approving the WETH to auction house
  const weth = await ethers.getContractAt("WETH", wethAddress);
  const approveTx = await weth.connect(buyer).approve(buy.address, fixedPrice);
  console.log(`Approve transaction submitted to: ${approveTx.hash}`);
  await approveTx.wait();

  //Buying the nft via using signature by Buyer
 const txn = await buy
    .connect(buyer)
    .buy(order, sellerSignature);
  console.log(`Buy Creation submitted at: ${txn.hash}`);
  await txn.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });