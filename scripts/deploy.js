const hre = require('hardhat');

async function main() {
  const SimpleStorageFactory = await hre.ethers.getContractFactory(
    'SimpleStorage'
  );
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();

  console.log('simpleSt', simpleStorage.address);

  if (hre.network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log('currentValue', currentValue.toString());

  const trxRes = await simpleStorage.store('10');
  await trxRes.wait(1);

  const updatedValue = await simpleStorage.retrieve();
  console.log('updatedValue', updatedValue.toString());
}

async function verify(address, constructorArguments = []) {
  console.log('Verificando Contrato');

  try {
    await hre.run('verify:verify', { address, constructorArguments });
  } catch (error) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log('Already Verified!');
    } else console.log('error', error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
