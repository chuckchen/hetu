import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying HetuPaymentGateway with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Use existing cUSDC wrapper as default token
  const WRAPPER_ADDRESS = "0xe6832A06dE93088Cd637ea35602075aEcD0f9998";

  console.log("\nDeploying HetuPaymentGateway...");
  const HetuPaymentGateway = await ethers.getContractFactory("HetuPaymentGateway");
  const gateway = await HetuPaymentGateway.deploy(WRAPPER_ADDRESS);
  await gateway.waitForDeployment();

  const gatewayAddress = await gateway.getAddress();
  console.log("HetuPaymentGateway deployed to:", gatewayAddress);

  // Verify configuration
  const defaultToken = await gateway.defaultToken();
  const owner = await gateway.owner();

  console.log("\n=== Deployment Summary ===");
  console.log("HetuPaymentGateway:", gatewayAddress);
  console.log("Default Token (cUSDC):", defaultToken);
  console.log("Owner:", owner);
  console.log("\n=== Update Frontend ===");
  console.log(`Update frontend/src/lib/contracts.ts:`);
  console.log(`  HETU_GATEWAY: '${gatewayAddress}' as const,`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
