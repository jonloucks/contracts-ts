import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { CONTRACTS } from "@jonloucks/contracts-ts";
import { CONTRACT as BOOLEAN_FACTORY } from "@jonloucks/contracts-ts/auxiliary/AtomicBooleanFactory";
import { CONTRACT as REFERENCE_FACTORY } from "@jonloucks/contracts-ts/auxiliary/AtomicReferenceFactory";
import { CONTRACT as INTEGER_FACTORY } from "@jonloucks/contracts-ts/auxiliary/AtomicIntegerFactory";
import { AtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/AtomicBoolean";
import { AtomicReference } from "@jonloucks/contracts-ts/auxiliary/AtomicReference";
import { AtomicInteger } from "@jonloucks/contracts-ts/auxiliary/AtomicInteger";

export { AtomicBoolean , AtomicReference, AtomicInteger, RequiredType };

/**
 * @module Convenience
 * @description
 * 
 * This module provides convenience functions for creating auxiliary types
 * using the shared global CONTRACTS instance. For performance-sensitive
 * applications, consider using factory instances directly to avoid the
 * overhead of enforcing the factory contract on each creation. 
 * 
 * Internal Note: To avoid circular dependencies, other modules should not
 * import from this module. Instead, they should import directly from the
 * source modules of the auxiliary types. 
 */

/**
 * Create an AtomicBoolean via the shared global CONTRACTS instance.
 * 
 * @param initialValue the initial boolean value
 * @returns the AtomicBoolean instance
 */
export function createAtomicBoolean(initialValue?: boolean): RequiredType<AtomicBoolean> {
  return CONTRACTS.enforce(BOOLEAN_FACTORY).createAtomicBoolean(initialValue);
}

/**
 * Create an AtomicReference via the shared global CONTRACTS instance.
 * 
 * @param initialValue the initial reference value
 * @returns the AtomicReference instance
 */
export function createAtomicReference<T>(initialValue?: T): RequiredType<AtomicReference<T>> {
  return CONTRACTS.enforce(REFERENCE_FACTORY).createAtomicReference(initialValue);
}

/**
 * Create an AtomicInteger via the shared global CONTRACTS instance.
 * 
 * @param initialValue the initial integer value
 * @returns the AtomicInteger instance
 */
export function createAtomicInteger(initialValue?: number): RequiredType<AtomicInteger> {
  return CONTRACTS.enforce(INTEGER_FACTORY).createAtomicInteger(initialValue);
}