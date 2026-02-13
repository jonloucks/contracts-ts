import { AutoClose, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { BindStrategyType } from "@jonloucks/contracts-ts/api/BindStrategy";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Type as PromisorType } from "@jonloucks/contracts-ts/api/Promisor";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";
import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";

/**
 * Wrapper method to create a Contracts wrapper which is responsible for managing
 * the lifecycle of the underlying Repository and Contracts instances.
 * 
 * @param contracts the underlying Contracts instance
 * @param repository the underlying Repository instance
 * @returns the Contracts implementation
 */
export function wrap(contracts: RequiredType<Contracts>, repository: RequiredType<Repository>): Contracts {
  return ContractsWrapper.internalCreate(contracts, repository);
}

// ---- Implementation details below ----

/**
 * The Contracts wrapper implementation
 * Contracts wrapper which is responsible for managing
 * the lifecycle of the underlying Repository and Contracts instances.
 */
class ContractsWrapper implements Contracts {

  static internalCreate(contracts: RequiredType<Contracts>, repository: RequiredType<Repository>): Contracts {
    return new ContractsWrapper(contracts, repository);
  }

  claim<T>(contract: Contract<T>): OptionalType<T> {
    return this.#contracts.claim(contract);
  }

  enforce<T>(contract: Contract<T>): RequiredType<T> {
    return this.#contracts.enforce(contract);
  }

  isBound<T>(contract: Contract<T>): boolean {
    return this.#contracts.isBound(contract);
  }

  bind<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategyType): AutoClose {
    return this.#contracts.bind(contract, promisor, bindStrategy);
  }

  autoOpen(): AutoClose {
    return this.open();
  }

  open(): AutoClose {
    const closeRepository: AutoClose = this.#repository.open();
    try {
      const closeConcurrency: AutoClose = this.#contracts.open();
      return inlineAutoClose(() => {
        try {
          closeConcurrency.close();
        } finally {
          closeRepository.close(); // ensure repository is closed
        }
      });
    } catch (thrown) {
      closeRepository.close();
      throw thrown
    }
  }

  toString(): string {
    return this.#contracts.toString();
  }

  private constructor(contracts: RequiredType<Contracts>, repository: RequiredType<Repository>) {
    this.#contracts = contracts;
    this.#repository = repository;
  }

  readonly #contracts: RequiredType<Contracts>;
  readonly #repository: RequiredType<Repository>;
};