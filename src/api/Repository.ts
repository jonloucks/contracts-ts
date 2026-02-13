import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Open, guard as openGuard } from "@jonloucks/contracts-ts/api/Open";
import { BindStrategy } from "@jonloucks/contracts-ts/api/BindStrategy";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { Type as PromisorType } from "@jonloucks/contracts-ts/api/Promisor";
import { guardFunctions, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";

/**
 * Configuration for Repository
 */ 
export interface Config {

  /**
   * Optional Contracts container for the Repository
   */
  contracts? : Contracts;

  /**
   * Optional required contracts for the Repository
   */
  requiredContracts?: Contract<unknown>[];
}

/**
 * A repository for multiple contract promisors
 * This is an opt-in feature to simplify the managing of many contract bindings.
 * 1. Optional feature to register required contracts.
 * 2. Optional feature to manage multiple contract bindings.
 */
export interface Repository extends Open {

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
export function guard(value: unknown): value is RequiredType<Repository> {
  return guardFunctions(value, 'store', 'keep', 'check', 'require') && openGuard(value);
}
