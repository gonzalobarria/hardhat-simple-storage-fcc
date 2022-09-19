const { assert } = require('chai');
const hre = require('hardhat');

describe('SimpleStorage', () => {
  let SimpleStorageFactory, simpleStorage;

  beforeEach(async () => {
    SimpleStorageFactory = await hre.ethers.getContractFactory('SimpleStorage');
    simpleStorage = await SimpleStorageFactory.deploy();
  });

  it('Debería comenzar con 0', async () => {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = '0';

    assert.equal(currentValue.toString(), expectedValue);
  });

  it('Debería actualizar el valor almacenado', async () => {
    const expectedValue = '7';
    const trxRes = await simpleStorage.store(expectedValue);
    await trxRes.wait(1);

    const currentValue = await simpleStorage.retrieve();
    assert(currentValue.toString(), expectedValue);
  });

  it('Should work correctly with the people struct and array', async function () {
    const expectedPersonName = 'Patrick';
    const expectedFavoriteNumber = '16';
    const trxRes = await simpleStorage.addPerson(
      expectedPersonName,
      expectedFavoriteNumber
    );
    await trxRes.wait(1);
    const { favoriteNumber, name } = await simpleStorage.people(0);

    assert.equal(name, expectedPersonName);
    assert.equal(favoriteNumber, expectedFavoriteNumber);
  });
});
