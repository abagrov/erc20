import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { env } from "../lib/env";
import { getContract } from "../lib/contract";
import { getWallet } from "../lib/wallet";
import { getAddress, isAddress, parseEther } from "ethers/lib/utils";
import { parseBadToken } from "../lib/parse";


task("transfer", "Invoke transfer.")
    .addParam("sender", "Sender address (msg.sender).", undefined, types.string)
    .addParam("to", "Recepient address.", undefined, types.string)
    .addParam("amount", "Amount of transfer operation.", undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        return getContract("BadToken", hre)
            .then((contract: Contract) => {
                const sender = getWallet(taskArgs.sender);
                const to = getWallet(taskArgs.to);
                return contract.connect(sender)
                    .transfer(to.address, parseBadToken(taskArgs.amount), { gasLimit: 500_000, });
            })
            .then((tr: TransactionResponse) => {
                process.stdout.write(`TX: https://rinkeby.etherscan.io/tx/${tr.hash}`);
            });
    });

task("mint", "Mint some tokens.")
    .addParam("to", "Recepient address.", undefined, types.string)
    .addParam("amount", "Amount of transfer operation.", undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        return getContract("BadToken", hre)
            .then((contract: Contract) => {
                const to = getWallet(taskArgs.to);
                return contract.mint(to.address, parseBadToken(taskArgs.amount), { gasLimit: 500_000, });
            })
            .then((tr: TransactionResponse) => {
                process.stdout.write(`TX: https://rinkeby.etherscan.io/tx/${tr.hash}`);
            });
    });

task("approve", "Perform approve operation.")
    .addParam("sender", "Sender address (msg.sender).", undefined, types.string)
    .addParam("spender", "Spender address.", undefined, types.string)
    .addParam("amount", "Amount of approve operation.", undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        return getContract("BadToken", hre)
            .then((contract: Contract) => {
                const sender = getWallet(taskArgs.sender);
                const spender = getWallet(taskArgs.spender);
                return contract.connect(sender)
                    .approve(spender.address, parseBadToken(taskArgs.amount), { gasLimit: 500_000, });
            })
            .then((tr: TransactionResponse) => {
                process.stdout.write(`TX: https://rinkeby.etherscan.io/tx/${tr.hash}`);
            });
    });

task("transfer-from", "Perform transferFrom operation.")
    .addParam("sender", "Sender address (msg.sender).", undefined, types.string)
    .addParam("from", "Sender address.", undefined, types.string)
    .addParam("to", "Spender address of approve.", undefined, types.string)
    .addParam("amount", "Amount of transferFrom operation.", undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        return getContract("BadToken", hre)
            .then((contract: Contract) => {
                const from = getWallet(taskArgs.from);
                const to = getWallet(taskArgs.to);
                const sender = getWallet(taskArgs.sender);
                return contract.connect(sender)
                    .transferFrom(from.address, to.address, parseBadToken(taskArgs.amount), { gasLimit: 500_000, });
            })
            .then((tr: TransactionResponse) => {
                process.stdout.write(`TX: https://rinkeby.etherscan.io/tx/${tr.hash}`);
            });
    });