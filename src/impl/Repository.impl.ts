import { AutoClose, AutoCloseType, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { AutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
import { BindStrategy, resolveBindStrategy } from "@jonloucks/contracts-ts/api/BindStrategy";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Promisor, Type as PromisorType, fromType } from "@jonloucks/contracts-ts/api/Promisor";
import { Config, Repository } from "@jonloucks/contracts-ts/api/Repository";
import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { contractCheck, contractsCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Idempotent } from "@jonloucks/contracts-ts/auxiliary/Idempotent";

import { create as createIdempotent } from "./Idempotent.impl.js";
import { StorageImpl } from "./Storage.impl.js";

/**
 * Factory method to create Repository instance.
 * 
 * @param contracts the Contracts instance to be used by the Repository
 * @returns the Repository implementation
 */
export function create(config?: Config): RequiredType<Repository> {
  return RepositoryImpl.internalCreate(config);
}

// ---- Implementation details below ----

/**
 * Implementation for Repository
 */
class RepositoryImpl implements Repository, AutoOpen {

  /**
   * AutoOpen.autoOpen override.
   */
  autoOpen(): AutoClose {
    return this.open();
  }

  /**
   * Open.open
   */
  open(): AutoClose {
    return this.idempotent.open();
  }

  /**
   * Repository.store override.
   */
  store<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategy | undefined | null): AutoClose {
    const validContract: Contract<T> = contractCheck(contract);
    const validPromisor: Promisor<T> = fromType(promisor);
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

  private constructor(config?: Config) {
    const validConfig: Config = config ?? {};
    this.contracts = contractsCheck(validConfig.contracts);
    if (validConfig.requiredContracts) {
      validConfig.requiredContracts.forEach((contract) => this.require(contract));
    }
  }

  private firstOpen(): AutoCloseType {
    for (const storage of this.#storedContracts.values()) {
      storage.bind();
    }
    this.check();
    return () => {
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

  static internalCreate(config?: Config): RequiredType<Repository> {
    return new RepositoryImpl(config);
  }

  private static ID_GENERATOR: number = 1;

  private readonly id: number = RepositoryImpl.ID_GENERATOR++;
  readonly #storedContracts = new Map<Contract<unknown>, StorageImpl<unknown>>();
  private readonly contracts: Contracts;
  private readonly idempotent: Idempotent = createIdempotent({
    open: () => this.firstOpen()
  });
  readonly #requiredContracts: Set<Contract<unknown>> = new Set<Contract<unknown>>();
}


