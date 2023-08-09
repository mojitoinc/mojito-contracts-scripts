# OnChainAuction Contract

## Introduction
This repository folder contains the scripts to intract the smart contract of a OnChainAuction. 

## Features
On-chain auctions have revolutionized the buying and selling of digital assets, especially non-fungible tokens (NFTs). Our motivation is to build and develop a blockchain-based auction using the decentralized Ethereum platform. The auction process is governed by a smart contract deployed on a blockchain platform like Ethereum. The smart contract defines the auction parameters, including the start time, end time, minimum bid, bid increments, and any additional rules specific to the auction. Bidders interact with the smart contract by submitting their bids directly from their wallets. Finally, the highest bidder wins the auction and gets the NFT from the token owner. The contract settles the funds to the settlement address concerned.


## Contract Address Info
-Contract Address : 
-Network          : Sepolia Testnet
-Abi              : Refer AuctionAbi.json


## Usage
- CreateAuction : Run the createAuction.js 
- Buy           : Run the bid-by-Eth.js during the auction Period
- EndAuction    : Run the endAuction.js after the auction end time