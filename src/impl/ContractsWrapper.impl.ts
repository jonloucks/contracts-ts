import { AutoClose, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { BindStrategyType } from "@jonloucks/contracts-ts/api/BindStrategy";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { PromisorType } from "@jonloucks/contracts-ts/api/Promisor";
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
    return this._contracts.claim(contract);
  }

  enforce<T>(contract: Contract<T>): RequiredType<T> {
    return this._contracts.enforce(contract);
  }

  isBound<T>(contract: Contract<T>): boolean {
    return this._contracts.isBound(contract);
  }

  bind<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategyType): AutoClose {
    return this._contracts.bind(contract, promisor, bindStrategy);
  }

  autoOpen(): AutoClose {
    return this.open();
  }

  open(): AutoClose {
    const closeRepository: AutoClose = this._repository.open();
    try {
      const closeConcurrency: AutoClose = this._contracts.open();
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
    return this._contracts.toString();
  }

  private constructor(contracts: RequiredType<Contracts>, repository: RequiredType<Repository>) {
    this._contracts = contracts;
    this._repository = repository;
  }

  private readonly _contracts: RequiredType<Contracts>;
  private readonly _repository: RequiredType<Repository>;
};