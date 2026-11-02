import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("----------------------------------------------------");
  console.log("🚀 Deploying WarrantyGo contract...");
  console.log(`👤 Deployer Address: ${deployer.address}`);
  console.log(`🌐 Network: ${network.name} (Chain ID: ${network.chainId})`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer Balance: ${ethers.formatEther(balance)} native tokens`);

  const WarrantyGoFactory = await ethers.getContractFactory("WarrantyGo");
  const warrantyGo = await WarrantyGoFactory.deploy();
  await warrantyGo.waitForDeployment();

  const contractAddress = await warrantyGo.getAddress();
  const deploymentTx = warrantyGo.deploymentTransaction();

  console.log("----------------------------------------------------");
  console.log(`✅ WarrantyGo deployed successfully!`);
  console.log(`📍 Contract Address: ${contractAddress}`);
  if (deploymentTx) {
    console.log(`📜 Deployment Tx Hash: ${deploymentTx.hash}`);
    console.log(`🔍 Explorer Link: https://scan.bohr.life/tx/${deploymentTx.hash}`);
  }
  console.log("----------------------------------------------------");

  // Output config file for frontend usage
  const deployedConfig = {
    contractAddress,
    chainId: Number(network.chainId),
    networkName: network.name,
    deployedAt: new Date().toISOString(),
  };

  const outputDir = path.join(process.cwd(), "lib", "generated");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "deployed-contract.json"),
    JSON.stringify(deployedConfig, null, 2)
  );

  console.log(`📁 Saved deployed config to lib/generated/deployed-contract.json`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
