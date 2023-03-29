import "dotenv/config";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-etherscan";




// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    mainnet: {
      chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      gasPrice:50000000000,
      accounts:[`0x${process.env.MAINNET_PRIVATE_KEY}`],
      allowUnlimitedContractSize: true,
    },
    rinkeby: {
      chainId: 4,
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      //gas: 2100000,
      gasPrice: 5000000000,
      gasMultiplier: 3,
      allowUnlimitedContractSize: true,
      accounts:[`0x${process.env.RINKEBY_PRIVATE_KEY}`]
    },
    mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      // gasPrice: 15000000000,
      // gasMultiplier: 4,
      accounts: [`0x${process.env.MUMBAI_PRIVATE_KEY}`],
      allowUnlimitedContractSize: true,
    },
    polygon: {
      chainId: 137,
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      gasPrice:750000000000,
      accounts: [`0x${process.env.POLYGON_PRIVATE_KEY}`],
      allowUnlimitedContractSize: true,
    },
    goerli: {
      chainId: 5,
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.GOERLI_PRIVATE_KEY}`],
      allowUnlimitedContractSize: true,
    },
  },
  etherscan: {
    apiKey: {
      polygon: "8QXJTKHHJXYENKH48NDC2S177I4Z43IMGZ",
      goerli: "Q54HT9CI9BXTQUN5NNISDHC1BCWENJQ7V6",
      mainnet: "Q54HT9CI9BXTQUN5NNISDHC1BCWENJQ7V6",
      mumbai:"8QXJTKHHJXYENKH48NDC2S177I4Z43IMGZ"
    },
    customChains: [
      {
        network: "polygon",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com/"
        }
      },
      {
        network: "mumbai",
        chainId: 80001,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://mumbai.polygonscan.com/"
        }
      },

    ]
  }
};

if (process.env.ALCHEMY_API_KEY) {
  if (process.env.MAINNET_PRIVATE_KEY) {
    config.networks!.mainnet = {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.MAINNET_PRIVATE_KEY}`],
    };
  }
  if (process.env.RINKEBY_PRIVATE_KEY) {
    config.networks!.rinkeby = {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY}`],
    };
  }
};

export default config;
