import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";

export function parseBadToken(value : string) : BigNumber{
    let amount = parseEther(value);
    return amount.div(1e12);
}