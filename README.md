mojito-contracts

### General
1. `yarn install`

2. Update .env file with the private key of the account in the each network and also update the alchemy API key 

3. `npx hardhat compile` - compile and generate ABIs

4. `npx hardhat run --network rinkeby scripts/genart/manifold/deploy_creator_implementation.ts` - run contract scripts

5. `npx hardhat verify --network rinkeby path_to _contract:ContractName.sol DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1" "Constructor argument 2"` - verify source code on Etherscan