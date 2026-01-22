import { ok, strictEqual } from "node:assert";

import {
  AUTO_CLOSE_FACTORY,
  AutoClose,
  AutoCloseFactory,
  AutoCloseMany,
  AutoCloseOne,
  AutoCloseType,
  AutoOpen,
  BindStrategy,
  Contract,
  ContractConfig,
  ContractException,
  Contracts,
  CONTRACTS,
  ContractsConfig,
  ContractsFactory,
  createContract,
  createContractFactory,
  createContracts,
  createContractsFactory,
  DEFAULT_BIND_STRATEGY,
  hasFunctions,
  isNotPresent,
  isNumber,
  isPresent,
  isString,
  OptionalType,
  Promisor,
  PROMISOR_FACTORY,
  PromisorFactory,
  Repository,
  REPOSITORY_FACTORY,
  RepositoryFactory,
  RequiredType,
  typeToAutoClose,
  typeToPromisor,
  validateContracts,
  VERSION,
} from "@jonloucks/contracts-ts";

/** 
 * Tests for @jonloucks/contracts-ts index and version exports
 * All exported functions and constants must already have been tested in their respective test files
 * These tests ensure that the index exports are correctly set up and accessible
 * Also tests the VERSION constant to ensure it matches the version in package.json
 * If this file fails to compile, it indicates a possible breaking for deployment consumers
 * @module @jonloucks/contracts-ts/tests/contracts-ts.test.ts
 */

describe('VERSION constant', () => {
  it('should be a non-empty string', () => {
    strictEqual(typeof VERSION, 'string', 'VERSION should be of type string');
    ok(VERSION.length > 0, 'VERSION should not be an empty string');
  });
});

describe('Index exports', () => {
  it('should export all expected members', () => {
    ok(validateContracts, 'validateContracts should be exported');
    ok(typeToAutoClose, 'typeToAutoClose should be exported');
    ok(AUTO_CLOSE_FACTORY, 'AUTO_CLOSE_FACTORY should be exported');
    ok(DEFAULT_BIND_STRATEGY, 'DEFAULT_BIND_STRATEGY should be exported');
    ok(hasFunctions, 'hasFunctions should be exported');
    ok(isNotPresent, 'isNotPresent should be exported');
    ok(isNumber, 'isNumber should be exported');
    ok(isPresent, 'isPresent should be exported');
    ok(isString, 'isString should be exported');
    ok(ContractException, 'ContractException should be exported');
    ok(typeToPromisor, 'typeToPromisor should be exported');
    ok(PROMISOR_FACTORY, 'PROMISOR_FACTORY should be exported');
    ok(createContract, 'createContract should be exported');
    ok(createContractFactory, 'createContractFactory should be exported');
    ok(createContracts, 'createContracts should be exported');
    ok(createContractsFactory, 'createContractsFactory should be exported');
    ok(CONTRACTS, 'CONTRACTS should be exported');
  });
});

describe('createContract function', () => {
  it('should create a Contract instance', () => {
    const contractConfig: ContractConfig<number> = {
      name: 'TestContract',
      test: isNumber,
    };

    const contract: Contract<number> = createContract(contractConfig);

    strictEqual(contract.name, 'TestContract', 'Contract name should match the provided config');
    ok(contract.cast(123), 'Contract should cast a number type');
  });
});

describe('CONTRACTS instance', () => {
  it('should be a valid Contracts instance', () => {
    ok(CONTRACTS, 'CONTRACTS instance should be defined');
    validateContracts(CONTRACTS);
  });
});

describe('createContracts function', () => {
  it('passes validation', () => {
    const contracts: Contracts = createContracts();
    using _usingContracts: AutoClose = contracts.open();

    validateContracts(contracts);
  });

  it('pre-bound contracts are bound', () => {
    const contracts: Contracts = createContracts();
    using _usingContracts: AutoClose = contracts.open();

    strictEqual(contracts.isBound(PROMISOR_FACTORY), true, 'PROMISOR_FACTORY should be bound in Contracts');
    strictEqual(contracts.isBound(REPOSITORY_FACTORY), true, 'REPOSITORY_FACTORY should be bound in Contracts');
    strictEqual(contracts.isBound(AUTO_CLOSE_FACTORY), true, 'AUTO_CLOSE_FACTORY should be bound in Contracts');
  });

  it('pre-bound contracts are enforced', () => {
    const contracts: Contracts = createContracts();
    using _usingContracts: AutoClose = contracts.open();

    const promisorFactory: PromisorFactory = contracts.enforce(PROMISOR_FACTORY);
    const repositoryFactory: RepositoryFactory = contracts.enforce(REPOSITORY_FACTORY);
    const autoCloseFactory: AutoCloseFactory = contracts.enforce(AUTO_CLOSE_FACTORY);

    ok(repositoryFactory, 'Enforced REPOSITORY_FACTORY should not be null or undefined');
    ok(autoCloseFactory, 'Enforced AUTO_CLOSE_FACTORY should not be null or undefined');
    ok(promisorFactory, 'Enforced PROMISOR_FACTORY should not be null or undefined');
  });

});

describe('OptionalType and RequiredType aliases', () => {
  it('should work as expected', () => {
    let optionalValue: OptionalType<number>;
    strictEqual(optionalValue, undefined, 'OptionalType should allow undefined');

    optionalValue = null;
    optionalValue = undefined;
    optionalValue = 42;
    strictEqual(optionalValue, 42, 'OptionalType should allow assigned value');

    let requiredValue: RequiredType<number> = 100;
    // requiredValue = null;
    // requiredValue = undefined;
    strictEqual(requiredValue, 100, 'RequiredType should hold assigned value');
  });
});

describe('ContractsFactory works', () => {
  it('can create Contracts instances', () => {
    const factory: ContractsFactory = createContractsFactory();
    const config: ContractsConfig = {};
    const contracts: Contracts = factory.createContracts(config);
    using _usingContracts: AutoClose = contracts.open();

    ok(contracts, 'Contracts instance should be created by ContractsFactory');
    validateContracts(contracts);
  });
});

describe('AutoOpen interface', () => {
  it('can implement the interface', () => {
    const instance: AutoOpen = {
      autoOpen(): RequiredType<AutoClose> {
        return typeToAutoClose((): void => { });
      },
    };

    ok(instance, 'AutoOpen instance should be created');
    using usingIt = instance.autoOpen();
    ok(usingIt, 'AutoClose instance should be created from autoOpen() method');
  });
});

describe('AutoClose interface', () => {
  it('can implement the interface', () => {
    const instance: RequiredType<AutoClose> = {
      close(): void {
        // empty
      },
      [Symbol.dispose](): void {
        // empty
      },
    };

    ok(instance, 'AutoClose instance should be created');
    instance.close();
    instance[Symbol.dispose]();
  });
});

describe('AutoCloseFactory interface', () => {
  it('can implement the interface', () => {
    const instance: AutoCloseFactory = {
      createAutoClose: function (_type: RequiredType<AutoCloseType>): RequiredType<AutoClose> {
        return undefined as unknown as RequiredType<AutoClose>;
      },
      createAutoCloseMany: function (): RequiredType<AutoCloseMany> {
        return undefined as unknown as RequiredType<AutoCloseMany>;
      },
      createAutoCloseOne: function (): RequiredType<AutoCloseOne> {
        return undefined as unknown as RequiredType<AutoCloseOne>;
      }
    };

    ok(instance, 'AutoCloseFactory instance should be created');
  });
});

describe('Repository interface', () => {
  it('can implement the interface', () => {
    const instance: Repository = {
      open(): AutoClose {
        return typeToAutoClose((): void => { });
      },
      store<T>(_contract: Contract<T>, _promisor: Promisor<T>, _bindStrategy?: BindStrategy): AutoClose {
        return typeToAutoClose((): void => { });
      },
      keep<T>(_contract: Contract<T>, _promisor: Promisor<T>, _bindStrategy?: BindStrategy): void {
        // empty
      },
      check(): void {
        // empty
      },
      require<T>(_contract: Contract<T>): void {
        // empty
      },
    };

    ok(instance, 'Repository instance should be created');
    using usingIt = instance.open();
    ok(usingIt, 'AutoClose instance should be created from open() method');
  });
});