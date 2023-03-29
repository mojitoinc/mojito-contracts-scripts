//Deploying the PriceFeed Contract inorder to fetch the latest price Equivalent for USD in 1WETH/1WMATIC
import { ethers } from "hardhat";

async function main() {
  //ERC20 Address like WETH / WMATIC etc.,
  const currencyAddress = [
    "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
    "0x0000000000000000000000000000000000001010",
  ];

  //Aggregator Price Feed Address provided by Chainlink in Mumbai
  const feedAddress = [
    "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
  ];

  // // Deployment: Royalty Contract
  const royaltyContract = await ethers.getContractFactory("RoyaltyEngine");
  const royalty = await royaltyContract.deploy(
    7000
  );
  await royalty.deployed();
  console.log(`PriceFeed Contract deployed to: ${royalty.address}`);

  // //Fetching the Latest price using getlatestPrice with currency address
  // const priceData = await priceFeed.getLatestPrice(currencyAddress[0]);
  // console.log(priceData[0].toString(), priceData[1].toString());

  const nftAddress = "0x10554262956614c3d49b19e22e00684cb62126cc";
  const wethAddress = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
  const platformAddress = "0xedA3b6B5009d1656D17d185903AF314c3fCB746B";
  const platformFee = 5;
  //Marketplace Contract Deployment
  const Buy = await ethers.getContractFactory("Marketplace");
  const buy = await Buy.deploy(
    nftAddress,
    wethAddress,
    platformAddress,
    platformFee,
    "0x8a32987D345E913FfABe4A443783d10cdFd56e9f"
  );

  await buy.deployed();
  console.log(`Marketplace Contract deployed to: ${buy.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
