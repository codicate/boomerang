// We don't have Ethereum specific assertions in Hardhat 3 yet
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toBytes, keccak256 } from "viem";

import { network } from "hardhat";

describe("Boomerang", async function () {
  const { viem } = await network.connect();

  // Helper function to create a random resource hash
  function createResourceHash(seed: string) {
    return keccak256(toBytes(seed));
  }

  it("Should set the owner to the deployer", async function () {
    // Deploy FakePYUSD token first
    const fakePYUSD = await viem.deployContract("Token");

    // Deploy Boomerang with the token address
    const boomerang = await viem.deployContract("Boomerang", [
      fakePYUSD.address,
    ]);

    // Get the deployer address
    const [deployer] = await viem.getWalletClients();

    // Check that the owner is set correctly
    assert.equal(
      await boomerang.read.owner(),
      deployer.account.address.toLowerCase()
    );
  });

  it("Should allow users to stake tokens", async function () {
    // Deploy contracts
    const fakePYUSD = await viem.deployContract("Token");
    const boomerang = await viem.deployContract("Boomerang", [
      fakePYUSD.address,
    ]);

    // Get wallet clients
    const [, user1] = await viem.getWalletClients();

    // Mint some tokens to user1
    const stakeAmount = await boomerang.read.STAKE_AMOUNT();
    await fakePYUSD.write.mint([user1.account.address, stakeAmount]);

    // Approve boomerang contract to spend tokens
    await fakePYUSD.write.approve([boomerang.address, stakeAmount], {
      account: user1.account,
    });

    // Stake tokens
    await viem.assertions.emitWithArgs(
      boomerang.write.stake({ account: user1.account }),
      boomerang,
      "Stake",
      [user1.account.address, stakeAmount]
    );

    // Check that user has staked
    assert.equal(await boomerang.read.hasStaked([user1.account.address]), true);

    // Check that total principal increased
    assert.equal(await boomerang.read.totalPrincipal(), stakeAmount);
  });

  it("Should allow users to refund their stake", async function () {
    // Deploy contracts
    const fakePYUSD = await viem.deployContract("Token");
    const boomerang = await viem.deployContract("Boomerang", [
      fakePYUSD.address,
    ]);

    // Get wallet clients
    const [, user1] = await viem.getWalletClients();

    // Mint some tokens to user1
    const stakeAmount = await boomerang.read.STAKE_AMOUNT();
    await fakePYUSD.write.mint([user1.account.address, stakeAmount]);

    // Approve and stake
    await fakePYUSD.write.approve([boomerang.address, stakeAmount], {
      account: user1.account,
    });
    await boomerang.write.stake({ account: user1.account });

    // Refund stake
    await viem.assertions.emitWithArgs(
      boomerang.write.refund({ account: user1.account }),
      boomerang,
      "Refund",
      [user1.account.address, stakeAmount]
    );

    // Check that user is no longer staked
    assert.equal(
      await boomerang.read.hasStaked([user1.account.address]),
      false
    );

    // Check that total principal decreased
    assert.equal(await boomerang.read.totalPrincipal(), 0n);
  });

  it("Should allow users to add resources", async function () {
    // Deploy contracts
    const fakePYUSD = await viem.deployContract("Token");
    const boomerang = await viem.deployContract("Boomerang", [
      fakePYUSD.address,
    ]);

    // Get wallet clients
    const [, user1] = await viem.getWalletClients();

    // Mint, approve and stake
    const stakeAmount = await boomerang.read.STAKE_AMOUNT();
    await fakePYUSD.write.mint([user1.account.address, stakeAmount]);
    await fakePYUSD.write.approve([boomerang.address, stakeAmount], {
      account: user1.account,
    });
    await boomerang.write.stake({ account: user1.account });

    // Create a resource hash
    const resourceHash = createResourceHash("resource1");

    // Add resource
    await viem.assertions.emitWithArgs(
      boomerang.write.addResource([resourceHash], { account: user1.account }),
      boomerang,
      "ResourceAdded",
      [user1.account.address, resourceHash]
    );

    // Check that resource is registered to the user
    assert.equal(
      await boomerang.read.resourceToContributor([resourceHash]),
      user1.account.address
    );
  });

  it("Should allow users to rate resources", async function () {
    // Deploy contracts
    const fakePYUSD = await viem.deployContract("Token");
    const boomerang = await viem.deployContract("Boomerang", [
      fakePYUSD.address,
    ]);

    // Get wallet clients
    const [, user1, user2] = await viem.getWalletClients();

    // Mint, approve and stake for both users
    const stakeAmount = await boomerang.read.STAKE_AMOUNT();

    // Setup user1
    await fakePYUSD.write.mint([user1.account.address, stakeAmount]);
    await fakePYUSD.write.approve([boomerang.address, stakeAmount], {
      account: user1.account,
    });
    await boomerang.write.stake({ account: user1.account });

    // Setup user2
    await fakePYUSD.write.mint([user2.account.address, stakeAmount]);
    await fakePYUSD.write.approve([boomerang.address, stakeAmount], {
      account: user2.account,
    });
    await boomerang.write.stake({ account: user2.account });

    // User1 adds a resource
    const resourceHash = createResourceHash("resource1");
    await boomerang.write.addResource([resourceHash], {
      account: user1.account,
    });

    // User2 rates the resource
    await viem.assertions.emitWithArgs(
      boomerang.write.rateResource([resourceHash], { account: user2.account }),
      boomerang,
      "RateResource",
      [user2.account.address, resourceHash, user1.account.address]
    );

    // Check that resource vote count increased
    assert.equal(await boomerang.read.resourceVotes([resourceHash]), 1n);

    // Check that contributor vote count increased
    assert.equal(
      await boomerang.read.contributorVotes([user1.account.address]),
      1n
    );

    // Check that total votes increased
    assert.equal(await boomerang.read.totalVotes(), 1n);

    // Check that user2 has rated this resource
    assert.equal(
      await boomerang.read.hasRated([user2.account.address, resourceHash]),
      true
    );
  });

  it("Should allow owner to simulate yield", async function () {
    // Deploy contracts
    const fakePYUSD = await viem.deployContract("Token");
    const boomerang = await viem.deployContract("Boomerang", [
      fakePYUSD.address,
    ]);

    // Get wallet clients
    const [deployer, user1, user2] = await viem.getWalletClients();

    // Setup users and resources
    const stakeAmount = await boomerang.read.STAKE_AMOUNT();

    // Setup user1
    await fakePYUSD.write.mint([user1.account.address, stakeAmount]);
    await fakePYUSD.write.approve([boomerang.address, stakeAmount], {
      account: user1.account,
    });
    await boomerang.write.stake({ account: user1.account });

    // Setup user2
    await fakePYUSD.write.mint([user2.account.address, stakeAmount]);
    await fakePYUSD.write.approve([boomerang.address, stakeAmount], {
      account: user2.account,
    });
    await boomerang.write.stake({ account: user2.account });

    // User1 adds a resource
    const resourceHash = createResourceHash("resource1");
    await boomerang.write.addResource([resourceHash], {
      account: user1.account,
    });

    // User2 rates the resource
    await boomerang.write.rateResource([resourceHash], {
      account: user2.account,
    });

    // Mint yield tokens to deployer
    const yieldAmount = 1000000n; // 1 PYUSD
    await fakePYUSD.write.mint([deployer.account.address, yieldAmount]);
    await fakePYUSD.write.approve([boomerang.address, yieldAmount], {
      account: deployer.account,
    });

    // Simulate yield
    await viem.assertions.emitWithArgs(
      boomerang.write.simulateYield([yieldAmount], {
        account: deployer.account,
      }),
      boomerang,
      "YieldAccrued",
      [deployer.account.address, yieldAmount]
    );

    // Check that total yield increased
    assert.equal(await boomerang.read.totalYield(), yieldAmount);

    // Check that yield per vote was calculated correctly
    const expectedYieldPerVote = (yieldAmount * 10n ** 18n) / 1n; // Only 1 vote exists
    assert.equal(await boomerang.read.yieldPerVote(), expectedYieldPerVote);
  });

  it("Should allow contributors to claim rewards", async function () {
    // Deploy contracts
    const fakePYUSD = await viem.deployContract("Token");
    const boomerang = await viem.deployContract("Boomerang", [
      fakePYUSD.address,
    ]);

    // Get wallet clients
    const [deployer, user1, user2] = await viem.getWalletClients();

    // Setup users and resources
    const stakeAmount = await boomerang.read.STAKE_AMOUNT();

    // Setup user1
    await fakePYUSD.write.mint([user1.account.address, stakeAmount]);
    await fakePYUSD.write.approve([boomerang.address, stakeAmount], {
      account: user1.account,
    });
    await boomerang.write.stake({ account: user1.account });

    // Setup user2
    await fakePYUSD.write.mint([user2.account.address, stakeAmount]);
    await fakePYUSD.write.approve([boomerang.address, stakeAmount], {
      account: user2.account,
    });
    await boomerang.write.stake({ account: user2.account });

    // User1 adds a resource
    const resourceHash = createResourceHash("resource1");
    await boomerang.write.addResource([resourceHash], {
      account: user1.account,
    });

    // User2 rates the resource
    await boomerang.write.rateResource([resourceHash], {
      account: user2.account,
    });

    // Simulate yield
    const yieldAmount = 1000000n; // 1 PYUSD
    await fakePYUSD.write.mint([deployer.account.address, yieldAmount]);
    await fakePYUSD.write.approve([boomerang.address, yieldAmount], {
      account: deployer.account,
    });
    await boomerang.write.simulateYield([yieldAmount], {
      account: deployer.account,
    });

    // User1 claims rewards
    await viem.assertions.emitWithArgs(
      boomerang.write.payout({ account: user1.account }),
      boomerang,
      "Payout",
      [user1.account.address, yieldAmount] // All yield goes to user1 since they have all the votes
    );

    // Check that user1's last claimed yield per vote is updated
    assert.equal(
      await boomerang.read.lastClaimedYieldPerVote([user1.account.address]),
      await boomerang.read.yieldPerVote()
    );

    // Check user1's balance increased
    assert.equal(
      await fakePYUSD.read.balanceOf([user1.account.address]),
      yieldAmount
    );
  });
});
