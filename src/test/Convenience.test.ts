import {
  AutoClose,
  bind,
  claim,
  Contract,
  CONTRACTS,
  createExtractor,
  createLifeCycle,
  createRepository,
  createSingleton,
  createValue,
  createContract,
  enforce,
  inlineAutoClose,
  isBoolean,
  isBound,
  isFunction,
  isNumber,
  isObject,
  isString,
  Promisor,
  Repository,
  RequiredType
} from "@jonloucks/contracts-ts/api/Convenience";
import { ok } from "node:assert";
import { used } from "../auxiliary/Checks";

// Convenience tests, all exports are simple inlines to fully tested functionality.

interface Customer {
  id: number;
  name: string;
}

function guardCustomer(instance: unknown): instance is RequiredType<Customer> {
  return isObject(instance) && 'id' in instance && 'name' in instance;
}

function createCustomerContract(): Contract<Customer> {
  return createContract<Customer>({
    name: "CustomerContract",
    test: guardCustomer,
  })
}

function createNumberContract(): Contract<number> {
  return createContract<number>({
    name: "NumberContract",
    test: isNumber,
  })
};

describe('Convenience Exports', () => {
  it('all expected exports are present', () => {
    ok(typeof bind === 'function', 'bind is exported');
    ok(typeof claim === 'function', 'claim is exported');
    ok(typeof createExtractor === 'function', 'createExtractor is exported');
    ok(typeof createLifeCycle === 'function', 'createLifeCycle is exported');
    ok(typeof createRepository === 'function', 'createRepository is exported');
    ok(typeof createSingleton === 'function', 'createSingleton is exported');
    ok(typeof createValue === 'function', 'createValue is exported');
    ok(typeof enforce === 'function', 'enforce is exported');
    ok(typeof CONTRACTS === 'object', 'CONTRACTS is exported');
    ok(typeof isBound === 'function', 'isBound is exported');
    ok(typeof createContract === 'function', 'createContract is exported');
    ok(typeof isNumber === 'function', 'isNumber is exported');
    ok(typeof isObject === 'function', 'isObject is exported');
    ok(typeof isString === 'function', 'isString is exported');
    ok(typeof inlineAutoClose === 'function', 'inlineAutoClose is exported');
    ok(typeof isBoolean === 'function', 'isBoolean is exported');
    ok(typeof isFunction === 'function', 'isFunction is exported');
  });
});
describe('Convenience Functionality', () => {
  it('Swath test', () => {
    const singletonContract: Contract<Customer> = createCustomerContract();
    const lifecycleContract: Contract<Customer> = createCustomerContract();
    const valueContract: Contract<Customer> = createCustomerContract();
    const extractorContract: Contract<number> = createNumberContract();

    const repository: Repository = createRepository();

    let nextId = 1;
    const customerFactory = (): Customer => {
      const id = nextId++;
      return { id, name: "customer-" + id };
    };
    const firstCustomer: Customer = customerFactory();
    const singletonPromisor: Promisor<Customer> = createSingleton<Customer>(customerFactory);
    const lifecyclePromisor: Promisor<Customer> = createLifeCycle<Customer>(customerFactory);
    const valuePromisor: Promisor<Customer> = createValue<Customer>(firstCustomer);
    const extractorPromisor: Promisor<number> = createExtractor<Customer, number>(
      lifecyclePromisor, (p: Customer) => p.id);

    repository.keep(singletonContract, singletonPromisor);
    repository.keep(lifecycleContract, lifecyclePromisor);
    repository.keep(valueContract, valuePromisor);
    repository.keep(extractorContract, extractorPromisor);

    using usingRepository: AutoClose = repository.open();
    used(usingRepository);

    ok(isBound(singletonContract), 'singleton is bound');
    ok(isBound(lifecycleContract), 'lifecycle is bound');
    ok(isBound(valueContract), 'value is bound');
    ok(isBound(extractorContract), 'extractor is bound');

    ok(claim(valueContract) == firstCustomer, 'claim value is first customer');
    ok(enforce(valueContract).id === 1, 'enforce value id is 1');
    ok(enforce(lifecycleContract).id === 2, 'enforce lifecycle first call id is next id');
    ok(enforce(lifecycleContract).id === 2, 'enforce lifecycle second call id is same id');
    ok(enforce(extractorContract) === 2, 'enforce extractor returns lifecycle id');
    ok(enforce(singletonContract).id === 3, 'enforce singleton first call returns next id');
  });
});
