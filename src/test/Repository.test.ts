import assert from 'node:assert';

import { Contract } from "contracts-ts/api/Contract";
import { ContractException } from "contracts-ts/api/ContractException";
import { Contracts } from "contracts-ts/api/Contracts";
import { LAWYER, Repository } from "contracts-ts/api/Repository";
import { CONTRACT as FACTORY, RepositoryFactory } from "contracts-ts/api/RepositoryFactory";
import { OptionalType } from "contracts-ts/api/Types";
import { Tools } from "contracts-ts/test/Test.tools.test";
import { createContract } from "contracts-ts";

describe('RepositoryFactory tests', () => {
    it('Repository FACTORY works', () => {
        Tools.withContracts((contracts: Contracts) => {
            assert.strictEqual(contracts.isBound(FACTORY), true);
            const repository: OptionalType<Repository> = contracts.enforce(FACTORY).create();
            assert.notStrictEqual(repository, null);
        });
    });

    it('Repository methods work', () => {
        Tools.withContracts((contracts: Contracts) => {
            const repository: OptionalType<Repository> = contracts.enforce(FACTORY).create();
            repository!.check(); // should not throw
        });
    });
});

//--- Repository Tests ---

test('repository_Factory', () => {
    Tools.withContracts((contracts: Contracts) => {
        const repositoryFactory: RepositoryFactory = contracts.enforce(FACTORY);

        Tools.assertObject(repositoryFactory);
    });
});

test('repository_contract', () => {
    Tools.withContracts((contracts: Contracts) => {
        const repositoryFactory: RepositoryFactory = contracts.enforce(FACTORY);
        const contract = LAWYER.createContract({});
        const repository = contracts.enforce(FACTORY).create();

        using usingBind = contracts.bind(contract, () => repository);

        const enforcedRepository = contracts.enforce(contract);

        assert.strictEqual(enforcedRepository, repository);
    });
});

test('repository_check_WithNoRequirements', () => {
    runWithScenario({
        accept: function (contracts: Contracts, repository: Repository): void {
            assert.notStrictEqual(repository.toString(), null, "toString should work");
        }
    });
});

test('repository_check_WithNoRequirements', () => {
    runWithScenario({
        accept: function (contracts: Contracts, repository: Repository): void {
            assert.doesNotThrow(() => repository.check());
        }
    });
});

test('repository_check_WithOneMissingRequirement_Throws', () => {
    runWithScenario({
        accept: function (contracts: Contracts, repository: Repository): void {
            const contract: Contract<number> = createContract<number>();
            repository.require(contract);

            Tools.assertThrows(ContractException, () => {
                repository.check();
            });
        }
    });
});

test('repository_check_WithFulfilledRequirements', () => {
    runWithScenario({
        accept: function (contracts: Contracts, repository: Repository): void {
            const contract: Contract<number> = createContract<number>();
            repository.require(contract);
            using useBinding = contracts.bind(contract, () => 42);

            assert.doesNotThrow(() => repository.check());
        }
    });
});

test('void repository_store_isBound', () => {
    runWithScenario({
        accept: function (contracts: Contracts, repository: Repository): void {
            const contract: Contract<string> = createContract<string>();
            {
                using useBinding = repository.store(contract, () => "x");
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
                using useBinding = repository.store(contract, () => "x");
                const text: string = contracts.enforce(contract);
                Tools.assertEquals("x", text, "contract deliverable should match");
            }
        }
    });
});

test('repository_store_WhenClosedTwice_DoesNothing', () => {
    runWithScenario({
        accept: function (contracts: Contracts, repository: Repository): void {
            const contract: Contract<number> = createContract<number>();
            using useBinding = repository.store(contract, () => 7);
            Tools.assertIdempotent(useBinding)
        }
    });
});

test('repository_store_WhenClosedTwice_DoesNothing', () => {
    runWithScenario({
        accept: function (contracts: Contracts, repository: Repository): void {
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
            using useBinding = repository.store(contract, () => "y");
            using usingSecondOpen = repository.open();
            Tools.assertEquals("y", contracts.enforce(contract), "contract deliverable should not change");
        }
    });
});

test('repository_close_WhenCalledTwice_DoesNothing', () => {
    runWithScenario({
        accept: function (contracts: Contracts, repository: Repository): void {
            const contract: Contract<number> = createContract<number>();

            using usingSecond = repository.open();
            Tools.assertIdempotent(usingSecond);
        }
    });
});

test('void repository_close_ReleasesResources', () => {
//      Tools.withContracts((contracts : Contracts) => {
//         Repository repository = contracts.enforce(FACTORY).get();
//         int count = 10;
//         List<Contract<Integer>> contractList = new ArrayList<>();
//         LinkedList<Integer> expectedOrder = new LinkedList<>();
//         List<Integer> actualOrder = new ArrayList<>();
//         for (int i = 0; i < count; i++) {
//             Integer deliverable = i;
//             Promisor<Integer> promisor = spy();
//             Repository referenceCount = new Repository();
//             when(promisor.demand()).thenReturn(deliverable);
//             when(promisor.incrementUsage()).thenAnswer((Answer<Integer>) invocation => referenceCount.incrementAndGet());
//             when(promisor.decrementUsage()).thenAnswer((Answer<Integer>) invocation => {
//                 int currentCount = referenceCount.decrementAndGet();
//                 if (currentCount == 0) {
//                     actualOrder.add(deliverable);
//                 }
//                 return currentCount;
//             });
//             Contract<Integer> contract = Contract.create("Contact " + deliverable);
//             contractList.add(contract);
//             expectedOrder.push(deliverable);
//             repository.keep(contract, promisor);
//         }
//         try (AutoClose closeRepository = repository.open()) {
//             AutoClose ignoreCloseRepository = closeRepository;
//             for (int i = 0; i < count; i++) {
//                 contracts.enforce(contractList.get(i));
//             }
//         }
//         assertFalse(actualOrder.isEmpty(), "Actual order should not be empty");
//         assertEquals(expectedOrder.size(), actualOrder.size(), "closed promisors count");
//         assertEquals(expectedOrder, actualOrder, "closed promisors order");
//     });
// }
});

test('repository_keep_ReplaceWhenOpen_Throws', () => {
    runWithScenario({
        accept: function (contracts: Contracts, repository: Repository): void {
            const contract: Contract<string> = createContract<string>();
            repository.keep(contract, () => "x");

            using closeRepository = repository.open();
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
        accept: function (contracts: Contracts, repository: Repository): void {
            Tools.assertEquals("y", contracts.enforce(contract), "Changing bindings before should be allowed.");
        }
    });
});

test('repository_keep_Replace_Works', () => {
    runWithScenario({
        accept: function (contracts: Contracts, repository: Repository): void {
            const contract: Contract<string> = createContract<string>({ replaceable: true });
            using closeFirstBinding = contracts.bind(contract, () => "x");
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
            using closeFirstBinding = contracts.bind(contract, () => "x");
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

            using usingBinding = contracts.bind(contract, () => "x");

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

        using closeRepository = repository.open();
        block.accept(contracts, repository);
    });
}


