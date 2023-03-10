const hre = require("hardhat");

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory("L2BSTToken");

  const gasPrice = await ContractFactory.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);

  const estimatedGas = await ContractFactory.signer.estimateGas(
    ContractFactory.getDeployTransaction()
  );
  console.log(`Estimated gas: ${estimatedGas}`);

  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerAddress = await ContractFactory.signer.address;
  const deployerBalance = await ContractFactory.signer.getBalance();
  console.log(`Deployer Address: ${deployerAddress}`);
  console.log(
    `Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`
  );
  console.log(
    `Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`
  );

  const contract = await ContractFactory.deploy();
  await contract.deployed();

  console.log(`Boost3rToken deployed to ${contract.address}`);
}

main().catch((error) => { 
  console.error(error);
  process.exitCode = 1;
});

// Boost3rToken contract deployed to 0x6280b9b5Aac7851eF857884b50b86129809aF7Ab on mantle testnet
