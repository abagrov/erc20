import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { getContract } from "../lib/contract";
import { getWallet } from "../lib/wallet";
import { parseBadToken } from "../lib/parse";
import { getProvider } from "../lib/provider";

task("approve", "Perform approve operation.")
    .addParam("sender", "Sender address (msg.sender).", undefined, types.string)
    .addParam("spender", "Spender address.", undefined, types.string)
    .addParam("amount", "Amount of approve operation.", undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        return getContract(hre)
            .then(async (contract: Contract) => {
                const sender = getWallet(taskArgs.sender);
                const spender = getWallet(taskArgs.spender);
                const gas = await getProvider().estimateGas(contract.connect(sender)
                    .approve(spender.address, parseBadToken(taskArgs.amount)));

                return contract.connect(sender)
                    .approve(spender.address, parseBadToken(taskArgs.amount), { gasLimit: gas, });
            })
            .then((tr: TransactionResponse) => {
                process.stdout.write(`TX: https://rinkeby.etherscan.io/tx/${tr.hash}`);
            });
    });