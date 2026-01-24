import { AutoClose, Contract, CONTRACTS, OptionalType, RequiredType } from "@jonloucks/contracts-ts";
import { PromisorType } from "@jonloucks/contracts-ts/api/Promisor";
import { BindStrategyType } from "@jonloucks/contracts-ts/api/BindStrategy";
import { CONTRACT as PROMISOR_FACTORY } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { Promisor } from "@jonloucks/contracts-ts/api/Promisor";
import { TransformType } from "@jonloucks/contracts-ts/api/Types";

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
export function claim<T>(contract: RequiredType<Contract<T>>): OptionalType<T> {
  return CONTRACTS.claim(contract);
}

/**
 * Enforce a deliverable from a Contract via the shared global CONTRACTS instance.
 * 
 * @param contract the Contract to enforce from
 * @returns the deliverable
 */
export function enforce<T>(contract: RequiredType<Contract<T>>): RequiredType<T> {
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
export function bind<T>(contract: RequiredType<Contract<T>>, promisor: PromisorType<T>, bindStrategy?: BindStrategyType): RequiredType<AutoClose> {
  return CONTRACTS.bind(contract, promisor, bindStrategy);
}

/**
 * Check if a Contract is bound via the shared global CONTRACTS instance.
 * 
 * @param contract the Contract to check
 * @returns true if the Contract is bound, false otherwise
 */
export function isBound<T>(contract: RequiredType<Contract<T>>): boolean {
  return CONTRACTS.isBound(contract);
}

/**
 * Creates a Promisor that returns the given value every time it is claimed.
 *
 * @param deliverable the value to return from the Promisor
 * @return The new Promisor
 * @param <T> the type of deliverable
 */
export function createValue<T>(deliverable: OptionalType<T>): RequiredType<Promisor<T>> {
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
export function createSingleton<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
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
export function createLifeCycle<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
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
export function createExtractor<T, R>(promisor: PromisorType<T>, extractor: TransformType<T, R>): RequiredType<Promisor<R>> {
  return enforce(PROMISOR_FACTORY).createExtractor(promisor, extractor);
}

