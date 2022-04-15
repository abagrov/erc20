import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { parseBadToken } from "../lib/parse";

describe("BadToken contract", function () {
  let factory;
  let contract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    factory = await ethers.getContractFactory("BadToken");
    [owner, addr1] = await ethers.getSigners();
    contract = await factory.deploy(owner.address);
    await contract.mint(owner.address, parseBadToken("1"));
  });

  describe("Owner check", function () {
    it("Only owner can burn", async function () {
      await expect(contract.burn(owner.address, parseBadToken("1"))).to.be.ok;
      await expect(contract.connect(addr1).burn(owner.address, parseBadToken("1"))).to.be.reverted;
    });

    it("Only owner can mint", async function () {
      await expect(contract.mint(owner.address, parseBadToken("1"))).to.be.ok;
      await expect(contract.connect(addr1).burn(owner.address, parseBadToken("1"))).to.be.reverted;
    });

    it("Transfer ownership", async function () {
      await contract.transferOwnership(addr1.address);
      await expect(contract.connect(addr1).burn(owner.address, parseBadToken("1"))).to.be.ok;
      await expect(contract.connect(owner).burn(owner.address, parseBadToken("1"))).to.be.reverted;
    });
  });

  describe("Transfer check", function () {
    it("Transfer with ok balance", async function () {
      let initialBalanceSender = await contract.balanceOf(owner.address);
      let initialBalanceRecepient = await contract.balanceOf(addr1.address);
      let amount = parseBadToken("1");

      await contract.transfer(addr1.address, amount);
      expect(await contract.balanceOf(addr1.address)).to.eql(amount.add(initialBalanceRecepient));
      expect(await contract.balanceOf(owner.address)).to.eql(initialBalanceSender.sub(amount));
    });

    it("Transfer more than avaliable", async function () {
      await expect(contract.transfer(addr1.address, parseBadToken("10"))).to.be.reverted;
    });

    it("Transfer to empty address", async function () {
      await expect(contract.transfer(DEFAULT_ADDRESS, parseBadToken("10"))).to.be.reverted;
    });
  });

  describe("Allowance check", function () {
    it("Transfer from with ok allowance", async function () {
      let amount = parseBadToken("1");

      await contract.mint(addr1.address, parseBadToken("10"));

      let initialBalanceOwner = await contract.balanceOf(owner.address);
      let initialBalanceAddr1 = await contract.balanceOf(addr1.address);

      await contract.connect(addr1).approve(owner.address, amount);

      await contract.transferFrom(addr1.address, owner.address, amount);

      expect(await contract.balanceOf(owner.address)).to.eql(amount.add(initialBalanceOwner));
      expect(await contract.balanceOf(addr1.address)).to.eql(initialBalanceAddr1.sub(amount));

      await expect(contract.transferFrom(addr1.address, owner.address, amount)).to.be.reverted;

      await expect(contract.transferFrom(DEFAULT_ADDRESS, owner.address, amount)).to.be.reverted;
      await expect(contract.transferFrom(addr1.address, DEFAULT_ADDRESS, amount)).to.be.reverted;
    });

    it("Transfer from more than allowance but less than balance", async function () {
      await contract.mint(addr1.address, parseBadToken("10"));
      let amount = parseBadToken("1");

      await contract.connect(addr1).approve(owner.address, amount);

      await expect(contract.transferFrom(addr1.address, owner.address, parseBadToken("5"))).to.be.reverted;
    });

    it("Transfer from more than balance but less than allowance", async function () {
      await contract.mint(addr1.address, parseBadToken("1"));
      let amount = parseBadToken("10");

      await contract.connect(addr1).approve(owner.address, amount);

      await expect(contract.transferFrom(addr1.address, owner.address, parseBadToken("5"))).to.be.reverted;
    });
  });
});
