import { ok } from "node:assert";
import { Contract, createContract, RequiredType } from "@jonloucks/contracts-ts";
import { isNumber, isObject } from "@jonloucks/contracts-ts/api/Types";
import { Promisor } from "@jonloucks/contracts-ts/api/Promisor";
import { claim, bind, isBound, enforce, createExtractor, createLifeCycle, createSingleton, createValue } from "@jonloucks/contracts-ts/api/Convenience";

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

describe('Convenience Tests', () => {
  it('Swath test', () => {
    const singletonContract: Contract<Customer> = createCustomerContract();
    const lifecycleContract: Contract<Customer> = createCustomerContract();
    const valueContract: Contract<Customer> = createCustomerContract();
    const extractorContract: Contract<number> = createNumberContract();

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

    using _usingSingleton = bind(singletonContract, singletonPromisor);
    using _usingLifecycle = bind(lifecycleContract, lifecyclePromisor);
    using _usingValue = bind(valueContract, valuePromisor);
    using _usingExtractor = bind(extractorContract, extractorPromisor);

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
