import { AutoClose, inlineAutoClose } from "contracts-ts/api/AutoClose";
import { AutoOpen } from "contracts-ts/api/AutoOpen";
import { BindStrategyType } from "contracts-ts/api/BindStrategy";
import { Contract } from "contracts-ts/api/Contract";
import { Contracts } from "contracts-ts/api/Contracts";
import { PromisorType } from "contracts-ts/api/Promisor";
import { Repository } from "contracts-ts/api/Repository";
import { OptionalType, RequiredType } from "contracts-ts/api/Types";

/**
 * Wrapper method to create a Contracts wrapper which is responsible for managing
 * the lifecycle of the underlying Repository and Contracts instances.
 * 
 * @param contracts the underlying Contracts instance
 * @param repository the underlying Repository instance
 * @returns the Contracts implementation
 */
export function wrap(contracts: RequiredType<Contracts>, repository: RequiredType<Repository>) {
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
    return this.contracts.claim(contract);
  }

  enforce<T>(contract: Contract<T>): RequiredType<T> {
    return this.contracts.enforce(contract);
  }

  isBound<T>(contract: Contract<T>): boolean {
    return this.contracts.isBound(contract);
  }

  bind<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategyType): AutoClose {
    return this.contracts.bind(contract, promisor, bindStrategy);
  }

  open(): AutoClose {
    const closeContracts: AutoClose = this.contracts.open();
    const thisRepository = this.repository;

    let opener: AutoOpen = {
      open() {
        try {
          return thisRepository.open();
        } catch (error) {
          closeContracts.close(); // if the repository fails to open, close the contracts
          throw error;
        }
      }
    };

    const closeRepository: AutoClose = opener.open();
    return inlineAutoClose(() => {
      try {
        closeRepository.close();
      } finally {
        closeContracts.close(); // ensure contracts are closed even if repository close fails
      }
    });
  }

  toString(): string {
    return this.contracts.toString();
  }

  private constructor(contracts: RequiredType<Contracts>, repository: RequiredType<Repository>) {
    this.contracts = contracts;
    this.repository = repository;
  }

  private readonly contracts: RequiredType<Contracts>;
  private readonly repository: RequiredType<Repository>;
};