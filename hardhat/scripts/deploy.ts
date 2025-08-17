import { network } from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = await network.connect("baseSepolia");
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying contracts with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  const tokens = {
    USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    PYUSD: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
  };
  const token_address = tokens.USDC;

  try {
    // Deploy boomerang contract
    console.log("📝 Deploying boomerang contract...");
    const boomerang = await ethers.deployContract("Boomerang", [token_address]);

    console.log("⏳ Waiting for deployment transaction to be mined...");
    await boomerang.waitForDeployment();

    const contractAddress = await boomerang.getAddress();
    console.log("✅ boomerang deployed to:", contractAddress);

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    const owner = await boomerang.owner();
    const stakeToken = await boomerang.stakeToken();
    const stakeAmount = await boomerang.STAKE_AMOUNT();

    console.log("👤 Contract Owner:", owner);
    console.log("🪙 Stake Token Address:", stakeToken);
    console.log("💵 Stake Amount:", ethers.formatUnits(stakeAmount, 6), "USDC");

    // Log deployment info for easy reference
    console.log("\n📄 DEPLOYMENT SUMMARY:");
    console.log("========================");
    console.log("Network: Base Sepolia");
    console.log("boomerang Contract:", contractAddress);
    console.log("Token Contract:", token_address);
    console.log("Deployer:", deployer.address);
    console.log("Block Number:", await ethers.provider.getBlockNumber());
    console.log("========================\n");

    // Save deployment info to file
    const deploymentInfo = {
      network: "sepolia",
      contractAddress: contractAddress,
      tokenAddress: token_address,
      deployer: deployer.address,
      blockNumber: await ethers.provider.getBlockNumber(),
      timestamp: new Date().toISOString(),
      transactionHash: boomerang.deploymentTransaction()?.hash,
    };

    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }

    // Save deployment info
    fs.writeFileSync(
      path.join(deploymentsDir, "sepolia.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("💾 Deployment info saved to deployments/sepolia.json");

    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Verify the contract on BaseScan (optional)");
    console.log("2. Fund the contract with USDC for yield distribution");
    console.log("3. Test the contract functionality on testnet");
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Handle script execution
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script execution failed:", error);
    process.exit(1);
  });
