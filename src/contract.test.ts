import { createContract } from './contract';

describe('Contract', () => {
  it('should create a contract with a unique id', () => {
    const contract1 = createContract('Contract1');
    const contract2 = createContract('Contract2');

    expect(contract1.id).toBeDefined();
    expect(contract2.id).toBeDefined();
    expect(contract1.id).not.toBe(contract2.id);
  });

  it('should store the contract name', () => {
    const contract = createContract('TestContract');
    expect(contract.name).toBe('TestContract');
  });

  it('should work without a name', () => {
    const contract = createContract();
    expect(contract.id).toBeDefined();
    expect(contract.name).toBeUndefined();
  });
});
