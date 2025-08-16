import { expect } from "chai";
import { network } from "hardhat";
import { Boomerang, FakePYUSD } from "../types/ethers-contracts/index.js";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/types";
const { ethers } = await network.connect();

describe("Boomerang Contract: Core Functionality", function () {
  let fakePYUSD: FakePYUSD;
  let boomerang: Boomerang;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let user3: HardhatEthersSigner;
  let stakeAmount: bigint;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy contracts
    fakePYUSD = await ethers.deployContract("FakePYUSD");
    boomerang = await ethers.deployContract("Boomerang", [fakePYUSD.target]);

    stakeAmount = await boomerang.STAKE_AMOUNT();

    // Mint tokens to users
    const mintAmount = ethers.parseUnits("10", 6); // 10 PYUSD each
    await fakePYUSD.mint(user1.address, mintAmount);
    await fakePYUSD.mint(user2.address, mintAmount);
    await fakePYUSD.mint(user3.address, mintAmount);
    await fakePYUSD.mint(owner.address, mintAmount);
  });

  describe("Staking and Refunding", function () {
    it("Should allow a user to stake successfully", async function () {
      const initialBalance = await fakePYUSD.balanceOf(user1.address);

      // User stakes
      await fakePYUSD.connect(user1).approve(boomerang.target, stakeAmount);
      await expect(boomerang.connect(user1).stake())
        .to.emit(boomerang, "Stake")
        .withArgs(user1.address, stakeAmount);

      // Verify state changes
      expect(await boomerang.hasStaked(user1.address)).to.be.true;
      expect(await boomerang.totalPrincipal()).to.equal(stakeAmount);
      expect(await fakePYUSD.balanceOf(boomerang.target)).to.equal(stakeAmount);
      expect(await fakePYUSD.balanceOf(user1.address)).to.equal(
        initialBalance - stakeAmount
      );
    });

    it("Should allow a user to stake and then refund their tokens", async function () {
      const initialBalance = await fakePYUSD.balanceOf(user1.address);

      // User stakes
      await fakePYUSD.connect(user1).approve(boomerang.target, stakeAmount);
      await boomerang.connect(user1).stake();

      // User refunds
      await expect(boomerang.connect(user1).refund())
        .to.emit(boomerang, "Refund")
        .withArgs(user1.address, stakeAmount);

      // Verify state is restored
      expect(await boomerang.hasStaked(user1.address)).to.be.false;
      expect(await boomerang.totalPrincipal()).to.equal(0);
      expect(await fakePYUSD.balanceOf(boomerang.target)).to.equal(0);
      expect(await fakePYUSD.balanceOf(user1.address)).to.equal(initialBalance);
    });

    it("Should handle multiple users staking independently", async function () {
      // Multiple users stake
      await fakePYUSD.connect(user1).approve(boomerang.target, stakeAmount);
      await fakePYUSD.connect(user2).approve(boomerang.target, stakeAmount);
      await boomerang.connect(user1).stake();
      await boomerang.connect(user2).stake();

      expect(await boomerang.totalPrincipal()).to.equal(stakeAmount * 2n);
      expect(await boomerang.hasStaked(user1.address)).to.be.true;
      expect(await boomerang.hasStaked(user2.address)).to.be.true;
    });
  });

  describe("Resource Management", function () {
    beforeEach(async function () {
      // Setup: users are staked for resource operations
      await fakePYUSD.connect(user1).approve(boomerang.target, stakeAmount);
      await fakePYUSD.connect(user2).approve(boomerang.target, stakeAmount);
      await fakePYUSD.connect(user3).approve(boomerang.target, stakeAmount);
      await boomerang.connect(user1).stake();
      await boomerang.connect(user2).stake();
      await boomerang.connect(user3).stake();
    });

    it("Should allow staked users to add resources", async function () {
      const resourceHash = ethers.keccak256(
        ethers.toUtf8Bytes("https://my-resource.com")
      );

      await expect(boomerang.connect(user1).addResource(resourceHash))
        .to.emit(boomerang, "ResourceAdded")
        .withArgs(user1.address, resourceHash);

      expect(await boomerang.resourceToContributor(resourceHash)).to.equal(
        user1.address
      );
    });

    it("Should allow users to rate resources", async function () {
      const resourceHash = ethers.keccak256(
        ethers.toUtf8Bytes("test-resource")
      );

      // User1 adds resource
      await boomerang.connect(user1).addResource(resourceHash);

      // User2 rates the resource
      await expect(boomerang.connect(user2).rateResource(resourceHash))
        .to.emit(boomerang, "RateResource")
        .withArgs(user2.address, resourceHash, user1.address);

      expect(await boomerang.resourceVotes(resourceHash)).to.equal(1);
      expect(await boomerang.contributorVotes(user1.address)).to.equal(1);
      expect(await boomerang.totalVotes()).to.equal(1);
      expect(await boomerang.hasRated(user2.address, resourceHash)).to.be.true;
    });

    it("Should allow multiple users to rate the same resource", async function () {
      const resourceHash = ethers.keccak256(
        ethers.toUtf8Bytes("popular-resource")
      );

      await boomerang.connect(user1).addResource(resourceHash);

      // Multiple users rate the same resource
      await boomerang.connect(user2).rateResource(resourceHash);
      await boomerang.connect(user3).rateResource(resourceHash);

      expect(await boomerang.resourceVotes(resourceHash)).to.equal(2);
      expect(await boomerang.contributorVotes(user1.address)).to.equal(2);
      expect(await boomerang.totalVotes()).to.equal(2);
    });

    it("Should handle multiple resources from different contributors", async function () {
      const resource1 = ethers.keccak256(ethers.toUtf8Bytes("resource1"));
      const resource2 = ethers.keccak256(ethers.toUtf8Bytes("resource2"));

      await boomerang.connect(user1).addResource(resource1);
      await boomerang.connect(user2).addResource(resource2);

      await boomerang.connect(user2).rateResource(resource1);
      await boomerang.connect(user1).rateResource(resource2);

      expect(await boomerang.resourceToContributor(resource1)).to.equal(
        user1.address
      );
      expect(await boomerang.resourceToContributor(resource2)).to.equal(
        user2.address
      );
      expect(await boomerang.contributorVotes(user1.address)).to.equal(1);
      expect(await boomerang.contributorVotes(user2.address)).to.equal(1);
    });
  });

  describe("Yield Distribution and Payouts", function () {
    beforeEach(async function () {
      // Setup: users are staked
      await fakePYUSD.connect(user1).approve(boomerang.target, stakeAmount);
      await fakePYUSD.connect(user2).approve(boomerang.target, stakeAmount);
      await fakePYUSD.connect(user3).approve(boomerang.target, stakeAmount);
      await boomerang.connect(user1).stake();
      await boomerang.connect(user2).stake();
      await boomerang.connect(user3).stake();
    });

    it("Should allow owner to add yield to the system", async function () {
      const yieldAmount = ethers.parseUnits("5", 6); // 5 PYUSD
      await fakePYUSD.connect(owner).approve(boomerang.target, yieldAmount);

      await expect(boomerang.connect(owner).simulateYield(yieldAmount))
        .to.emit(boomerang, "YieldAccrued")
        .withArgs(owner.address, yieldAmount);

      expect(await boomerang.totalYield()).to.equal(yieldAmount);
    });

    it("Should allow a contributor to receive votes and claim the full yield", async function () {
      // Setup: user1 adds resource and gets voted by user2
      const resourceHash = ethers.keccak256(
        ethers.toUtf8Bytes("https://my-resource.com")
      );
      await boomerang.connect(user1).addResource(resourceHash);
      await boomerang.connect(user2).rateResource(resourceHash);

      // Owner adds yield
      const yieldAmount = ethers.parseUnits("0.5", 6); // $0.5 yield
      await fakePYUSD.connect(owner).approve(boomerang.target, yieldAmount);
      await boomerang.connect(owner).simulateYield(yieldAmount);

      // Contributor claims payout
      const initialBalance = await fakePYUSD.balanceOf(user1.address);

      await expect(boomerang.connect(user1).payout())
        .to.emit(boomerang, "Payout")
        .withArgs(user1.address, yieldAmount);

      const finalBalance = await fakePYUSD.balanceOf(user1.address);
      expect(finalBalance - initialBalance).to.equal(yieldAmount);
    });

    it("Should distribute yield proportionally between multiple contributors", async function () {
      // Setup: Two resources with different vote counts
      const resource1Hash = ethers.keccak256(ethers.toUtf8Bytes("resource1"));
      const resource2Hash = ethers.keccak256(ethers.toUtf8Bytes("resource2"));

      await boomerang.connect(user1).addResource(resource1Hash);
      await boomerang.connect(user2).addResource(resource2Hash);

      // user1 gets 2 votes, user2 gets 1 vote
      await boomerang.connect(user2).rateResource(resource1Hash);
      await boomerang.connect(user3).rateResource(resource1Hash);
      await boomerang.connect(user1).rateResource(resource2Hash);

      expect(await boomerang.contributorVotes(user1.address)).to.equal(2);
      expect(await boomerang.contributorVotes(user2.address)).to.equal(1);
      expect(await boomerang.totalVotes()).to.equal(3);

      // Owner adds yield
      const yieldAmount = ethers.parseUnits("0.99", 6); // $0.99 yield
      await fakePYUSD.connect(owner).approve(boomerang.target, yieldAmount);
      await boomerang.connect(owner).simulateYield(yieldAmount);

      // Both contributors claim payouts
      const user1_initialBalance = await fakePYUSD.balanceOf(user1.address);
      const user2_initialBalance = await fakePYUSD.balanceOf(user2.address);

      await boomerang.connect(user1).payout();
      await boomerang.connect(user2).payout();

      const user1_finalBalance = await fakePYUSD.balanceOf(user1.address);
      const user2_finalBalance = await fakePYUSD.balanceOf(user2.address);

      const user1_reward = user1_finalBalance - user1_initialBalance;
      const user2_reward = user2_finalBalance - user2_initialBalance;

      // user1 should get 2/3 of yield ($0.66), user2 should get 1/3 ($0.33)
      expect(user1_reward).to.equal(ethers.parseUnits("0.66", 6));
      expect(user2_reward).to.equal(ethers.parseUnits("0.33", 6));
    });

    it("Should handle multiple yield distributions over time", async function () {
      // Setup voting
      const resourceHash = ethers.keccak256(
        ethers.toUtf8Bytes("test-resource")
      );
      await boomerang.connect(user1).addResource(resourceHash);
      await boomerang.connect(user2).rateResource(resourceHash);

      // First yield and payout
      const firstYield = ethers.parseUnits("1", 6);
      await fakePYUSD.connect(owner).approve(boomerang.target, firstYield);
      await boomerang.connect(owner).simulateYield(firstYield);

      const balanceBefore = await fakePYUSD.balanceOf(user1.address);
      await boomerang.connect(user1).payout();
      const balanceAfterFirst = await fakePYUSD.balanceOf(user1.address);

      expect(balanceAfterFirst - balanceBefore).to.equal(firstYield);

      // Second yield and payout
      const secondYield = ethers.parseUnits("0.5", 6);
      await fakePYUSD.connect(owner).approve(boomerang.target, secondYield);
      await boomerang.connect(owner).simulateYield(secondYield);

      await boomerang.connect(user1).payout();
      const balanceAfterSecond = await fakePYUSD.balanceOf(user1.address);

      expect(balanceAfterSecond - balanceAfterFirst).to.equal(secondYield);
    });
  });

  describe("Basic Error Handling", function () {
    beforeEach(async function () {
      await fakePYUSD.connect(user1).approve(boomerang.target, stakeAmount);
      await fakePYUSD.connect(user2).approve(boomerang.target, stakeAmount);
      await boomerang.connect(user1).stake();
      await boomerang.connect(user2).stake();
    });

    it("Should reject duplicate resource registration", async function () {
      const resourceHash = ethers.keccak256(ethers.toUtf8Bytes("test-hash"));
      await boomerang.connect(user1).addResource(resourceHash);

      await expect(
        boomerang.connect(user2).addResource(resourceHash)
      ).to.be.revertedWith("Error: Resource hash already registered");
    });

    it("Should reject self-rating", async function () {
      const resourceHash = ethers.keccak256(ethers.toUtf8Bytes("test-hash"));
      await boomerang.connect(user1).addResource(resourceHash);

      await expect(
        boomerang.connect(user1).rateResource(resourceHash)
      ).to.be.revertedWith("Error: Cannot rate your own resource");
    });

    it("Should reject duplicate rating", async function () {
      const resourceHash = ethers.keccak256(ethers.toUtf8Bytes("test-hash"));
      await boomerang.connect(user1).addResource(resourceHash);

      await boomerang.connect(user2).rateResource(resourceHash); // First rating succeeds

      await expect(
        boomerang.connect(user2).rateResource(resourceHash)
      ).to.be.revertedWith("Error: Already rated this resource");
    });

    it("Should reject payout when no new rewards available", async function () {
      const resourceHash = ethers.keccak256(ethers.toUtf8Bytes("test-hash"));
      await boomerang.connect(user1).addResource(resourceHash);
      await boomerang.connect(user2).rateResource(resourceHash);

      // Add yield and claim first payout
      const yieldAmount = ethers.parseUnits("0.1", 6);
      await fakePYUSD.connect(owner).approve(boomerang.target, yieldAmount);
      await boomerang.connect(owner).simulateYield(yieldAmount);
      await boomerang.connect(user1).payout();

      // Second payout should fail
      await expect(boomerang.connect(user1).payout()).to.be.revertedWith(
        "Error: No new rewards to claim"
      );
    });
  });
});
