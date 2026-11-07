import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("====================================================");
  console.log("🚀 Deploying WarrantyGo contract...");
  console.log(`👤 Deployer Address: ${deployer.address}`);
  console.log(`🌐 Network: ${network.name} (Chain ID: ${chainId})`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer Balance: ${ethers.formatEther(balance)} BOT`);

  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || 20000000000n;
  console.log(`⛽ Current Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);

  const explorerBase = chainId === 677 ? "https://scan.botchain.ai" : "https://scan.bohr.life";

  console.log("📦 Creating contract factory...");
  const WarrantyGoFactory = await ethers.getContractFactory("WarrantyGo");

  console.log("📤 Sending deployment transaction with minimal gas...");
  const warrantyGo = await WarrantyGoFactory.deploy({
    gasPrice: gasPrice,
  });

  console.log("⏳ Awaiting transaction confirmation on-chain...");
  await warrantyGo.waitForDeployment();

  const contractAddress = await warrantyGo.getAddress();
  const deploymentTx = warrantyGo.deploymentTransaction();

  let gasUsed = 0n;
  let totalFee = 0n;
  if (deploymentTx) {
    const receipt = await deploymentTx.wait();
    if (receipt) {
      gasUsed = receipt.gasUsed;
      totalFee = gasUsed * (receipt.gasPrice || gasPrice);
    }
  }

  console.log("====================================================");
  console.log(`🎉 WarrantyGo successfully deployed to ${chainId === 677 ? "MAINNET" : "TESTNET"}!`);
  console.log(`📍 Contract Address: ${contractAddress}`);
  if (deploymentTx) {
    console.log(`📜 Tx Hash: ${deploymentTx.hash}`);
    console.log(`🔍 Explorer Link: ${explorerBase}/tx/${deploymentTx.hash}`);
    console.log(`📊 Contract on Explorer: ${explorerBase}/address/${contractAddress}`);
    console.log(`⚡ Gas Used: ${gasUsed.toString()} units`);
    console.log(`💵 Total Fee Paid: ${ethers.formatEther(totalFee)} BOT`);
  }
  console.log("====================================================");

  // Output config file for frontend usage
  const deployedConfig = {
    contractAddress,
    chainId,
    networkName: chainId === 677 ? "botchainMainnet" : network.name,
    explorerUrl: `${explorerBase}/address/${contractAddress}`,
    deploymentTx: deploymentTx ? deploymentTx.hash : null,
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

  console.log(`📁 Saved deployment record to lib/generated/deployed-contract.json`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
