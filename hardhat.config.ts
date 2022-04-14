import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import "./tasks/interact";

chai.use(solidity);
dotenv.config();

const { ALCHEMY_URL, CONTRACT_PRIVATE } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: ALCHEMY_URL,
      accounts: [`0x${CONTRACT_PRIVATE}`]
    },
    hardhat: {},
  },
};

export default config;
