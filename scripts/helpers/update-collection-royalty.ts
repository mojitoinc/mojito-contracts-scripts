import { ethers } from "hardhat";
import * as fs from "fs";
import { parse } from 'csv-parse';

async function main() {
  const contract_address = "0x2e46e36fD5f756b10AeDdd90d52d5D5C2eAE0964";
  
  const contract = await ethers.getContractAt(
    "RoyaltyEngine",
    contract_address
  );

  const processFile = async () => {
    let records = []
    const parser = fs
    .createReadStream(`/home/dell/Downloads/update-royalty.csv`)
    .pipe(parse({
      delimiter: ','
    }));
    for await (const record of parser) {
      // Work with each record
      records.push(record)
    }
    return records
  }
  let resultSet = await processFile();
  console.log("Result",resultSet);
  for(let i=0; i<resultSet.length; i++){
    let percentage= resultSet[i][3]*100
    console.log("ContractAddress",resultSet[i][0],"Recipient Address",resultSet[i][2],"Percentage",percentage); 
    const receipt = await contract.setRoyalty(resultSet[i][0],[resultSet[i][2]],[percentage]);
    console.log("Waiting for confirmations...");
    const tx = await receipt.wait(1);
    console.log(`Confirmed! Gas used: ${tx.gasUsed.toString()}`);
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });