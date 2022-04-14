import _ from "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

async function main() {
  dotenv.config();

  const { OWNER_ADDRESS } = process.env;

  const factory = await ethers.getContractFactory("BadToken");
  const contract = await factory.deploy(OWNER_ADDRESS);

  await contract.deployed();

  console.log("ReferendumContract deployed to:", `https://rinkeby.etherscan.io/address/${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
