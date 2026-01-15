import { AUTO_CLOSE_NONE, AutoClose, inlineAutoClose } from "contracts-ts/api/AutoClose";
import { contractCheck } from "contracts-ts/api/auxiliary/Checks";
import { RequiredType } from "contracts-ts/api/auxiliary/Types";
import { BindStrategy, resolveBindStrategy } from "contracts-ts/api/BindStrategy";
import { Contract } from "contracts-ts/api/Contract";
import { ContractException } from "contracts-ts/api/ContractException";
import { Contracts } from "contracts-ts/api/Contracts";
import { Promisor, PromisorType, typeToPromisor } from "contracts-ts/api/Promisor";
import { Repository } from "contracts-ts/api/Repository";

import { OptionalType } from "contracts-ts/api/auxiliary/Types";
import { Idempotent, create as createIdempotent } from "contracts-ts/impl/Idempotent.impl";
import { StorageImpl } from "contracts-ts/impl/Storage.impl";

/**
 * Factory method to create Repository instance.
 * 
 * @param contracts the Contracts instance to be used by the Repository
 * @returns the Repository implementation
 */
export function create(contracts: Contracts): RequiredType<Repository> {
  return RepositoryImpl.internalCreate(contracts);
}

// ---- Implementation details below ----

/**
 * Implementation for {@link io.github.jonloucks.contracts.api.Repository}
 * @see io.github.jonloucks.contracts.api.Repository
 */
class RepositoryImpl implements Repository {

  /**
   * AutoOpen.open override.
   */
  open(): AutoClose {
    if (this.idempotent.transitionToOpen()) {
      return this.firstOpen();
    }
    return AUTO_CLOSE_NONE;
  }

  /**
   * Repository.store override.
   */
  store<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategy | undefined | null): AutoClose {
    const validContract: Contract<T> = contractCheck(contract);
    const validPromisor: Promisor<T> = typeToPromisor(promisor);
    const validBindStrategy: BindStrategy = resolveBindStrategy(bindStrategy);

    if (this.#storedContracts.has(validContract) && this.idempotent.isOpen()) {
      throw new ContractException("The contract " + validContract + "  is already stored.");
    }

    const storage: StorageImpl<T | null> = new StorageImpl<T | null>(this.contracts, validContract, validPromisor, validBindStrategy);

    if (this.idempotent.isOpen()) {
      storage.bind();
    }

    this.#storedContracts.set(validContract, storage);

    return inlineAutoClose(() => {
      if (this.#storedContracts.get(validContract) === storage) {
        this.#storedContracts.delete(validContract);
        storage.close();
      }
    });
  }

  /**
   * Repository.keep override.
   */
  keep<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: OptionalType<BindStrategy>): void {
    this.store(contract, promisor, resolveBindStrategy(bindStrategy));
  }

  /**
   * Repository.check override.
   */
  check(): void {
    this.#requiredContracts.forEach((contract) => {
      if (!this.contracts.isBound(contract)) {
        throw new ContractException("The contract " + contract + " is required.");
      }
    });
  }

  /**
   * Repository.require override.
   */
  require<T>(contract: Contract<T>): void {
    const validContract: Contract<T> = contractCheck(contract);

    this.#requiredContracts.add(validContract);
  }

  /**
   * Object.toString override.
   */
  toString(): string {
    return `Repository(id=${this.id}, size=${this.#storedContracts.size})`;
  }

  private constructor(contracts: Contracts) {
    this.contracts = contracts;
  }

  private firstOpen(): AutoClose {
    for (const storage of this.#storedContracts.values()) {
      storage.bind();
    }
    this.check();
    return inlineAutoClose(() => this.closeFirstOpen());
  }

  private closeFirstOpen(): void {
    if (this.idempotent.transitionToClosed()) {
      this.reverseCloseStorage();
    }
  }

  private reverseCloseStorage(): void {
    const storageStack: StorageImpl<unknown>[] = [];
    for (const storage of this.#storedContracts.values()) {
      storageStack.push(storage);
    }
    try {
      while (storageStack.length > 0) {
        storageStack.pop()!.close();
      }
    } finally {
      this.#storedContracts.clear();
    }
  }

  static internalCreate(contracts: Contracts): RequiredType<Repository> {
    return new RepositoryImpl(contracts);
  }

  private static ID_GENERATOR: number = 1;

  private readonly id: number = RepositoryImpl.ID_GENERATOR++;
  readonly #storedContracts = new Map<Contract<unknown>, StorageImpl<unknown>>();
  private readonly contracts: Contracts;
  private readonly idempotent: Idempotent = createIdempotent();
  readonly #requiredContracts: Set<Contract<unknown>> = new Set<Contract<unknown>>();
}


