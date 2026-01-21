import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { AutoOpen, guard as autoOpenGuard } from "@jonloucks/contracts-ts/api/AutoOpen";
import { BindStrategy } from "@jonloucks/contracts-ts/api/BindStrategy";
import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@jonloucks/contracts-ts/api/Lawyer";
import { PromisorType } from "@jonloucks/contracts-ts/api/Promisor";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { OptionalType, hasFunctions } from "@jonloucks/contracts-ts/api/Types";

/**
 * A repository for multiple contract promisors
 * This is an opt-in feature to simplify the managing of many contract bindings.
 * 1. Optional feature to register required contracts.
 * 2. Optional feature to manage multiple contract bindings.
 */
export interface Repository extends AutoOpen {

  /**
   * Store the binding.
   * Note: Replacing a Contract already promised in this Repository is forbidden after the Repository is opened.
   * If the Repository is not open an existing Promisor can be replaced, otherwise it is forbidden.
   * If the Repository is not open, the binding will be applied when repository is opened.
   * If the Repository has already been opened the binding is applied immediately
   * Note: If never explicitly closed, the order of closing promisors is the reverse order they are stored
   * @param contract the contract to be bound
   * @param promisor the promisor to be bounded
   * @param bindStrategy the config for storing the binding
   * @return AutoClose responsible for removing the binding from this Repository
   * @param <T> the type of contract deliverable
   */
  store<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategy): AutoClose

  /**
   * Keep the binding for the life of the repository
   * If the Repository is not open, the binding will be created when repository is opened.
   * If the Repository has already been opened the binding is created immediately
   * Note: The order of closing promisors is the reverse order they are stored
   * @param contract the contract to be bound
   * @param promisor the promisor to be bounded
   * @param bindStrategy the config for storing the binding

   * @param <T> the type of contract deliverable
   */
  keep<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategy): void;

  /**
   * Check that all requirements have fulfilled
   */
  check(): void;

  /**
   * Added a required contract
   * @param contract the contract to be required
   * @param <T> the type of contract deliverable
   */
  require<T>(contract: Contract<T>): void;
}

/**
 * Type guard for Repository
 * 
 * @param value the value to check
 * @return true if value is Repository, false otherwise
 */
export function guard(value: unknown): value is Repository {
  return hasFunctions(value, 'store', 'keep', 'check', 'require') && autoOpenGuard(value);
}

/**
 * For creating a Contract for Repository with duck-typing checks.
 * @deprecated use createContract with guard instead
 */
export const LAWYER: Lawyer<Repository> = new class implements Lawyer<Repository> {

  /**
   * Lawyer.isDeliverable override
   */
  isDeliverable<X extends Repository>(instance: unknown): instance is OptionalType<X> {
    return guard(instance);
  }

  /** 
   * Lawyer.createContract override
   */
  createContract<X extends Repository>(config?: ContractConfig<X> | undefined): Contract<X> {
    const copy: ContractConfig<X> = { ...config }

    copy.typeName ??= "Repository";
    copy.test ??= this.isDeliverable;

    return createContract<X>(copy);
  }
};
