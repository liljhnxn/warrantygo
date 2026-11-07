import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const BOTCHAIN_RPC = process.env.BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const accounts = PRIVATE_KEY ? [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    botchain: {
      url: BOTCHAIN_RPC,
      chainId: 677,
      accounts,
      gasPrice: 20000000000,
    },
  },
  etherscan: {
    apiKey: {
      botchain: process.env.ETHERSCAN_API_KEY || "empty",
    },
    customChains: [
      {
        network: "botchain",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
