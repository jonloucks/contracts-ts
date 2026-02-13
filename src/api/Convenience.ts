import { VERSION, type Contract, type ContractConfig, CONTRACTS, createContract } from "@jonloucks/contracts-ts";

import { AutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { type Contracts, type Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
import { type Promisor, type Type as PromisorType } from "@jonloucks/contracts-ts/api/Promisor";
import { type AutoClose, type AutoCloseType, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { type BindStrategyType } from "@jonloucks/contracts-ts/api/BindStrategy";
import { CONTRACT as PROMISOR_FACTORY } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { CONTRACT as REPOSITORY_FACTORY } from "@jonloucks/contracts-ts/api/RepositoryFactory";
import { type Repository, type Config as RepositoryConfig } from "@jonloucks/contracts-ts/api/Repository";
import { type OptionalType, type RequiredType, type UndefinedType, isNumber, isFunction, isString, isBoolean, isObject, guardFunctions } from "@jonloucks/contracts-ts/api/Types";
import { type Transform, type Type as TransformType } from "@jonloucks/contracts-ts/auxiliary/Transform";
import { validateContracts } from "@jonloucks/contracts-ts/auxiliary/Validate";

/**
 * @module Convenience
 * @description
 * 
 * This module provides convenience functions for creating  types
 * using the shared global CONTRACTS instance. For performance-sensitive
 * applications, consider using factory instances directly to avoid the
 * overhead of enforcing the factory contract on each creation. 
 * 
 * Internal Note: To avoid circular dependencies, other modules should not
 * import from this module. Instead, they should import directly from the
 * source modules of the types. 
 */

/**
 * Claim a deliverable from a Contract via the shared global CONTRACTS instance.
 * 
 * @param contract the Contract to claim from
 * @returns the deliverable
 */
function claim<T>(contract: RequiredType<Contract<T>>): OptionalType<T> {
  return CONTRACTS.claim(contract);
}

/**
 * Enforce a deliverable from a Contract via the shared global CONTRACTS instance.
 * 
 * @param contract the Contract to enforce from
 * @returns the deliverable
 */
function enforce<T>(contract: RequiredType<Contract<T>>): RequiredType<T> {
  return CONTRACTS.enforce(contract);
}

/**
 * Bind a Promisor to a Contract via the shared global CONTRACTS instance.
 * 
 * @param contract the Contract to bind to
 * @param promisor the PromisorType to bind
 * @param bindStrategy optional BindStrategyType
 * @returns an AutoClose to manage the binding lifecycle
 */
function bind<T>(contract: RequiredType<Contract<T>>, promisor: PromisorType<T>, bindStrategy?: BindStrategyType): RequiredType<AutoClose> {
  return CONTRACTS.bind(contract, promisor, bindStrategy);
}

/**
 * Check if a Contract is bound via the shared global CONTRACTS instance.
 * 
 * @param contract the Contract to check
 * @returns true if the Contract is bound, false otherwise
 */
function isBound<T>(contract: RequiredType<Contract<T>>): boolean {
  return CONTRACTS.isBound(contract);
}

/**
 * Creates a Promisor that returns the given value every time it is claimed.
 *
 * @param deliverable the value to return from the Promisor
 * @return The new Promisor
 * @param <T> the type of deliverable
 */
function createValue<T>(deliverable: OptionalType<T>): RequiredType<Promisor<T>> {
  return enforce(PROMISOR_FACTORY).createValue(deliverable);
}

/**
 * Creates a Promisor that only calls the source Promisor once and then always
 * returns that value.
 * Note: increment and decrementUsage are relayed to the source promisor.
 *
 * @param promisor the source Promisor
 * @return The new Promisor
 * @param <T> the type of deliverable
 */
function createSingleton<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
  return enforce(PROMISOR_FACTORY).createSingleton(promisor);
}

/**
 * Reference counted, lazy loaded, with opt-in 'open' and 'close' invoked on deliverable.
 * Note: increment and decrementUsage are relayed to the source promisor.
 *
 * @param promisor the source promisor
 * @return the new Promisor
 * @param <T> the type of deliverable
 */
function createLifeCycle<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
  return enforce(PROMISOR_FACTORY).createLifeCycle(promisor);
}

/**
 * Extract values from the deliverable of a source Promisor.
 * Note: increment and decrementUsage are relayed to the source promisor.
 *
 * @param promisor the source promisor
 * @param extractor the function that gets an object from the deliverable. For example Person  => Age
 * @return the new Promisor
 * @param <T> the type of deliverable
 * @param <R> the new Promisor deliverable type
 */
function createExtractor<T, R>(promisor: PromisorType<T>, extractor: TransformType<T, R>): RequiredType<Promisor<R>> {
  return enforce(PROMISOR_FACTORY).createExtractor(promisor, extractor);
}

/**
 * Factory method to create a Repository via the shared global REPOSITORY_FACTORY instance.
 * 
 * @param config optional configuration for the Repository
 * @returns the Repository implementation
 */
function createRepository(config?: RepositoryConfig): RequiredType<Repository> {
  return enforce(REPOSITORY_FACTORY).createRepository(config);
}

export {
  type AutoClose,
  type AutoCloseType,
  type AutoOpen,
  bind,
  type BindStrategyType,
  claim,
  createExtractor,
  createLifeCycle,
  createRepository,
  createSingleton,
  createValue,
  type Contract,
  type ContractConfig,
  ContractException,
  type Contracts,
  type ContractsConfig,
  CONTRACTS,
  createContract,
  enforce,
  guardFunctions,
  inlineAutoClose,
  isBound,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
  type OptionalType,
  type Promisor,
  type PromisorType,
  type Repository,
  type RepositoryConfig,
  type RequiredType,
  type Transform,
  type TransformType,
  type UndefinedType,
  validateContracts,
  VERSION
};

