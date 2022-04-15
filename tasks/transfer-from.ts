import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { getContract } from "../lib/contract";
import { getWallet } from "../lib/wallet";
import { parseBadToken } from "../lib/parse";
import { getProvider } from "../lib/provider";

task("transfer-from", "Perform transferFrom operation.")
    .addParam("sender", "Sender address (msg.sender).", undefined, types.string)
    .addParam("from", "Sender address.", undefined, types.string)
    .addParam("to", "Spender address of approve.", undefined, types.string)
    .addParam("amount", "Amount of transferFrom operation.", undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        return getContract(hre)
            .then(async (contract: Contract) => {
                const from = getWallet(taskArgs.from);
                const to = getWallet(taskArgs.to);
                const sender = getWallet(taskArgs.sender);

                const gas = await getProvider().estimateGas(contract.connect(sender)
                    .transferFrom(from.address, to.address, parseBadToken(taskArgs.amount)));

                return contract.connect(sender)
                    .transferFrom(from.address, to.address, parseBadToken(taskArgs.amount), { gasLimit: gas, });
            })
            .then((tr: TransactionResponse) => {
                process.stdout.write(`TX: https://rinkeby.etherscan.io/tx/${tr.hash}`);
            });
    });