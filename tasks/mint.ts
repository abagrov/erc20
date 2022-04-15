import { task, types } from "hardhat/config";
import { BigNumber, Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { getContract } from "../lib/contract";
import { getWallet } from "../lib/wallet";
import { parseBadToken } from "../lib/parse";
import { getProvider } from "../lib/provider";

task("mint", "Mint some tokens.")
    .addParam("to", "Recepient address.", undefined, types.string)
    .addParam("amount", "Amount of transfer operation.", undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        return getContract(hre)
            .then(async (contract: Contract) => {
                const to = getWallet(taskArgs.to);
                const gas = await getProvider().estimateGas(contract.mint(to.address, parseBadToken(taskArgs.amount)));
                return contract.mint(to.address, parseBadToken(taskArgs.amount), { gasLimit: gas, });
            })
            .then((tr: TransactionResponse) => {
                process.stdout.write(`TX: https://rinkeby.etherscan.io/tx/${tr.hash}`);
            });
    });