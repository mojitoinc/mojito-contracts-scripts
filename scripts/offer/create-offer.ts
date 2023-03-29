import { ethers } from "hardhat";
import { utils } from "ethers";

async function main() {
    const accounts = await ethers.getSigners();
    const user = accounts[2];
    console.log(user.address,accounts[0].address);
    //Mumbai Polygon Address
    const NFT_ADDRESS = "0xa61b3d7d9de0733e83d5961aa473635c28f8a4c5";
    const nftMedia = await ethers.getContractAt("ERC721CreatorImplementation", NFT_ADDRESS);

    const OFFER_ADDRESS = "0xCb11040c90ABa9c36afe4944c6eb7Bc33165A6E3";
    const offerContractAddress = await ethers.getContractAt("Offers", OFFER_ADDRESS);
    const WETH_ADDRESS = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";

    const tokenOwner = await nftMedia.ownerOf(7);
    console.log(tokenOwner);
    // // //Approving Auction House for the Bid
    // const approveForAllTx1 = await nftMedia.connect(user).isApprovedForAll(user.address,offerContractAddress.address);
    // console.log(approveForAllTx1)
    // const approveForAllTx = await nftMedia.connect(user).setApprovalForAll(offerContractAddress.address, true);
    // console.log(`Approve transaction submitted to: ${approveForAllTx.hash}`);
    // await approveForAllTx.wait(1);

    const OFFER_PRICE = utils.parseEther('0.000004');

    // // Approving the WETH to auction house
    // const weth = await ethers.getContractAt("WETH", WETH_ADDRESS);
    // const approveTx = await weth.connect(offerer).approve(offerContractAddress.address, OFFER_PRICE);
    // console.log(`Approve transaction submitted to: ${approveTx.hash}`);
    // await approveTx.wait();

    // //Creating Offer
    // const TOKEN_ID = 7;
    // const createOffertx = await offerContractAddress.connect(offerer).createOffer(
    //     TOKEN_ID,
    //     nftMedia.address,
    //     user.address,
    //     OFFER_PRICE,
    //     WETH_ADDRESS //currency address
    // );
    // console.log(`Offer Creation submitted at: ${createOffertx.hash}`)
    // console.log(`${createOffertx.args}`)
    // await createOffertx.wait();

    const data = await offerContractAddress.offers(39);
    console.log(data);

    // //Completing Offer
    const filloffer = await offerContractAddress.connect(user).fillOffer(39,WETH_ADDRESS,OFFER_PRICE );
    console.log(`Completing Offer submitted to: ${filloffer.hash}`);
    await filloffer.wait();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.error);
    process.exit(1);
  });