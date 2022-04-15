import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { getContract } from "../lib/contract";
import { getWallet } from "../lib/wallet";
import { parseBadToken } from "../lib/parse";
import { getProvider } from "../lib/provider";

task("transfer", "Invoke transfer.")
    .addParam("sender", "Sender address (msg.sender).", undefined, types.string)
    .addParam("to", "Recepient address.", undefined, types.string)
    .addParam("amount", "Amount of transfer operation.", undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        return getContract(hre)
            .then(async (contract: Contract) => {
                const sender = getWallet(taskArgs.sender);
                const to = getWallet(taskArgs.to);

                const gas = await getProvider().estimateGas(contract.connect(sender)
                    .transfer(to.address, parseBadToken(taskArgs.amount)));

                return contract.connect(sender)
                    .transfer(to.address, parseBadToken(taskArgs.amount), { gasLimit: gas, });
            })
            .then((tr: TransactionResponse) => {
                process.stdout.write(`TX: https://rinkeby.etherscan.io/tx/${tr.hash}`);
            });
    });