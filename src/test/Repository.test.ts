import { doesNotThrow, notStrictEqual, strictEqual } from "node:assert";

import { createContract } from "@jonloucks/contracts-ts";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Repository, guard } from "@jonloucks/contracts-ts/api/Repository";
import { CONTRACT as FACTORY, RepositoryFactory } from "@jonloucks/contracts-ts/api/RepositoryFactory";
import { OptionalType } from "@jonloucks/contracts-ts/api/Types";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test";
import { assertGuard } from "./helper.test";

describe('RepositoryFactory tests', () => {
  it('Repository FACTORY works', () => {
    Tools.withContracts((contracts: Contracts) => {
      strictEqual(contracts.isBound(FACTORY), true, "Repository FACTORY is bound");
      const repository: OptionalType<Repository> = contracts.enforce(FACTORY).create();
      notStrictEqual(repository, null, "Repository created is not null");
    });
  });

  it('Repository methods work', () => {
    Tools.withContracts((contracts: Contracts) => {
      const repository: OptionalType<Repository> = contracts.enforce(FACTORY).create();
      doesNotThrow(() => {
      repository!.check(); // should not throw
      }, "Repository.check() should not throw when no requirements are set");
    });
  });
});

//--- Repository Tests ---

assertGuard(guard, 
  'store', 'keep', 'check', 'require', 'open'
);

test('repository_Factory', () => {
  Tools.withContracts((contracts: Contracts) => {
    const repositoryFactory: RepositoryFactory = contracts.enforce(FACTORY);

    Tools.assertObject(repositoryFactory);
  });
});

test('repository_check_WithNoRequirements', () => {
  runWithScenario({
    accept: function (_contracts: Contracts, repository: Repository): void {
      notStrictEqual(repository.toString(), null, "toString should work");
    }
  });
});

test('repository_check_WithNoRequirements', () => {
  runWithScenario({
    accept: function (_contracts: Contracts, repository: Repository): void {
      doesNotThrow(() => repository.check(), "repository.check() should not throw with no requirements");
    }
  });
});

test('repository_check_WithOneMissingRequirement_Throws', () => {
  runWithScenario({
    accept: function (_contracts: Contracts, repository: Repository): void {
      const contract: Contract<number> = createContract<number>();
      repository.require(contract);

      Tools.assertThrows(ContractException, () => {
        repository.check();
      }, "repository.check() should throw with one missing requirement");
    }
  });
});

test('repository_check_WithFulfilledRequirements', () => {
  runWithScenario({
    accept: function (contracts: Contracts, repository: Repository): void {
      const contract: Contract<number> = createContract<number>();
      repository.require(contract);
      using _useBinding = contracts.bind(contract, () => 42);

      doesNotThrow(() => repository.check(), "repository.check() should not throw with fulfilled requirements");
    }
  });
});

test('void repository_store_isBound', () => {
  runWithScenario({
    accept: function (contracts: Contracts, repository: Repository): void {
      const contract: Contract<string> = createContract<string>();
      {
        using _useBinding = repository.store(contract, () => "x");
        Tools.assertTrue(contracts.isBound(contract), "Contract should have been bound");
      }
      Tools.assertFalse(contracts.isBound(contract), "Contract should not be bound");
    }
  });
});

test('repository_store_Works', () => {
  runWithScenario({
    accept: function (contracts: Contracts, repository: Repository): void {
      const contract: Contract<string> = createContract<string>();
      {
        using _useBinding = repository.store(contract, () => "x");
        const text: string = contracts.enforce(contract);
        Tools.assertEquals("x", text, "contract deliverable should match");
      }
    }
  });
});

test('repository_store_WhenClosedTwice_DoesNothing', () => {
  runWithScenario({
    accept: function (_contracts: Contracts, repository: Repository): void {
      const contract: Contract<number> = createContract<number>();
      using useBinding = repository.store(contract, () => 7);
      Tools.assertIdempotent(useBinding)
    }
  });
});

test('repository_store_WhenClosedTwice_DoesNothing', () => {
  runWithScenario({
    accept: function (_contracts: Contracts, repository: Repository): void {
      const contract: Contract<string> = createContract<string>();
      using closeStore = repository.store(contract, () => "x");
      Tools.assertIdempotent(closeStore);
    }
  });
});

test('repository_open_WhenCalledTwice_DoesNothing', () => {
  runWithScenario({
    accept: function (contracts: Contracts, repository: Repository): void {
      const contract: Contract<string> = createContract<string>();
      using _useBinding = repository.store(contract, () => "y");
      using _usingSecondOpen = repository.open();
      Tools.assertEquals("y", contracts.enforce(contract), "contract deliverable should not change");
    }
  });
});

test('repository_close_WhenCalledTwice_DoesNothing', () => {
  runWithScenario({
    accept: function (_contracts: Contracts, repository: Repository): void {

      using usingSecond = repository.open();
      Tools.assertIdempotent(usingSecond);
    }
  });
});

test('repository_keep_ReplaceWhenOpen_Throws', () => {
  runWithScenario({
    accept: function (_contracts: Contracts, repository: Repository): void {
      const contract: Contract<string> = createContract<string>();
      repository.keep(contract, () => "x");

      using _closeRepository = repository.open();
      Tools.assertThrowsCompliantError(ContractException, () => repository.keep(contract, () => "y"));
    }
  });
});

test('repository_keep_ReplaceBeforeOpen_Works', () => {
  const contract: Contract<string> = createContract<string>();

  runWithScenario({
    beforeRepositoryOpen: function (repository: Repository): void {
      repository.keep(contract, () => "x");
      repository.keep(contract, () => "y");
    },
    accept: function (contracts: Contracts, _repository: Repository): void {
      Tools.assertEquals("y", contracts.enforce(contract), "Changing bindings before should be allowed.");
    }
  });
});

test('repository_keep_Replace_Works', () => {
  runWithScenario({
    accept: function (contracts: Contracts, repository: Repository): void {
      const contract: Contract<string> = createContract<string>({ replaceable: true });
      using _closeFirstBinding = contracts.bind(contract, () => "x");
      repository.keep(contract, () => "y");
      const text: string = contracts.enforce(contract);
      Tools.assertEquals("y", text, "contract deliverable replace should match");
    }
  });
});

test('repository_keep_WhenNotReplaceableAndBound_IsIgnored', () => {
  runWithScenario({
    accept: function (contracts: Contracts, repository: Repository): void {
      const contract: Contract<string> = createContract<string>();
      using _closeFirstBinding = contracts.bind(contract, () => "x");
      repository.keep(contract, () => "y");
      const text: string = contracts.enforce(contract);
      Tools.assertEquals("x", text, "contract deliverable should not change");
    }
  });
});

test('repository_keep_WhenNotReplaceableAndBoundAnd_BIND_ALWAYS_Throws', () => {
  runWithScenario({
    accept: function (contracts: Contracts, repository: Repository): void {
      const contract: Contract<string> = createContract<string>({
        replaceable: false
      });

      using _usingBinding = contracts.bind(contract, () => "x");

      Tools.assertThrows(ContractException, () => {
        repository.keep(contract, () => "y", "ALWAYS");
      });
    }
  });
});

interface ScenarioConfig {
  accept(contracts: Contracts, repository: Repository): void;
  beforeRepositoryOpen?(repository: Repository): void;
}

function runWithScenario(block: ScenarioConfig): void {
  Tools.withContracts((contracts: Contracts) => {
    const repository: Repository = contracts.enforce(FACTORY).create();
    block.beforeRepositoryOpen?.(repository);

    using _closeRepository = repository.open();
    block.accept(contracts, repository);
  });
}


