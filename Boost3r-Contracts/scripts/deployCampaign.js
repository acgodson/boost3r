const hre = require("hardhat");

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory("Campaign");

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

  console.log(`Campaign Contract deployed to ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Campaign contract deployed to 0x3a55e2fDB61012108B07754243066d912B4c5F50 on mantle testnet
