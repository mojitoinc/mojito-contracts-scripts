import { ethers } from "hardhat";
const fs = require("fs");

async function main() {
  const details_array = [
    ["0x74594C2Fb7e5AA26a857DBa2AC6141ADD66d3E5A", 1],
    ["0x01dB485f57Dc000E761b85641F78C9D212A2eEaB", 10],
    ["0x37DfAa62F0fE5e6ebe990ef1a0722F5279962E37", 1],
    ["0x4777cc3235cA645dbA868D7b1Dd36b0128079EFf", 2],
    ["0x21D9e031b32454C798b8a672d4e2E75f21Addeb8", 2],
    ["0x446070bC934C54DbEF3204828D674f27d88bBE05", 1],
    ["0x0B5C658f5698d1fC764Bcfd985578307F01d5fE1", 2],
    ["0x2135E4ef9e2488d3Fe272653b4d125516A2abC35", 2],
    ["0xA7668508CE47e29B8fD192433C84FAFe4D1415D3", 1],
    ["0xCFDAE6d4701d10d41Ba4D08D9342B02a9e18b90C", 1],
    ["0x34a047831F6a7fc64933656F6295F3b7f5442329", 1],
    ["0x7486b372AFE6a6f7D4823CF08FA7820e6118a53F", 2],
    ["0x5dDDE47d3685362aaC7a0DbF3Bd79cFeF112E449", 1],
  ];
  let receipt;
  for (let i = 0; i < details_array.length; i++) {
    let text = "\n" + details_array[i][0] + "," + details_array[i][1];
    fs.appendFileSync("Logs.txt", text, function (error: any) {
      if (error) {
        return console.log("error");
      }
    });
    var contract = await ethers.getContractAt(
      "ERC721CreatorImplementation",
      "0xF1f036Cebb4b64F138E4F57754Edbceb64FB80FC"
    );

    try {
      receipt = await contract["mintBaseBatch(address,uint16)"](
        details_array[i][0],
        details_array[i][1]
      );
      text = "," + receipt.hash;
      fs.appendFileSync("Logs.txt", text, function (error: any) {
        if (error) {
          return console.log("error");
        }
      });
      console.log("Waiting for confirmations...");
      console.log(
        "Address : " +
          details_array[i][0] +
          " Quantity : " +
          details_array[i][1]
      );
      const tx2 = await receipt.wait(1);
      console.log(`Confirmed! Gas used: ${tx2.gasUsed.toString()}`);
      text = ",Completed";
      fs.appendFileSync("Logs.txt", text, function (error: any) {
        if (error) {
          return console.log("error");
        }
      });
    } catch (error) {
      let text =
        "Address : " +
        details_array[i][0] +
        " Quantity : " +
        details_array[i][1] +
        " Error : " +
        error +
        "\n";
      fs.appendFileSync("Errorlogs.txt", text, function (error: any) {
        if (error) {
          return console.log("error");
        }
      });
      console.error(error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
