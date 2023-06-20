# Dutch Auction Contract

## Introduction
This repository folder contains the scripts to interact the smart contract of a Dutch auction. 

## Features
- Start with a high initial price and gradually decrease over time.
- Buyers can place bids at any time during the auction.
- The auction ends when a buyer accepts the current price.
- The contract ensures fairness and transparency in the auction process.
- Compatible with ETH and ERC20 tokens.

## Contract Address Info
Use following Contract Address & ABI for interact the Dutch Auction methods

=>Dutch Auction Info

- Contract Address : 0xBE6F430D96a4Ae28a3401Af5154D8fD8173F2680
- Network          : Sepolia Testnet
- Abi              : Refer DutchAuctionAbi.json
  
=>Dutch Auction Info
  
- Contract Address : 0x44092487B4B66b53E5D5f2B463B6721b7A232204
- Network          : Sepolia Testnet
- Abi              : Refer DutchUtilityAbi.json

## Usage
- Place a bid: Run the buy-by-Eth.ts during the auction Period
- Rebate     : Run the rebate.ts. after the end of auction
