const hre = require("hardhat");

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory("PoapNFT");

  const gasPrice = await ContractFactory.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);

  const deployerAddress = await ContractFactory.signer.address;
  const deployerBalance = await ContractFactory.signer.getBalance();
  console.log(`Deployer Address: ${deployerAddress}`);
  console.log(
    `Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`
  );

  const contract = await ContractFactory.deploy("Brows3r POAP", "BPOAP", 10000);
  await contract.deployed();

  console.log(`POAP Contract deployed to address ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Boost3rToken contract deployed to 0xADcA893D3D74830b7f30d5D29bA59530Db98a585 on mantle testnet
