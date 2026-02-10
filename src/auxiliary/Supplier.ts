/**
 * Supplier.ts
 * Defines a Supplier type that can supply values of type T.
 */

import { guardFunctions, isFunction, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

/** 
 * A method that supplies a value of type T
 */
export type Method<T> = () => T;

/** 
 * A Supplier that supplies values of type T
 */
export interface Supplier<T> { supply(): T; } 

/** 
 * A type that can be a Method, Supplier, or a value of type T
 */
export type Type<T> = Method<T> | Supplier<T> | T; 

/**
 * Duck type guard check for Supplier
 * 
 * @param instance the instance to check
 * @param <T> the type of value supplied
 * @returns true if instance is a Supplier, false otherwise
 */
export function guard<T>(instance: unknown): instance is RequiredType<Supplier<T>> {
  return guardFunctions(instance, 'supply');
}

/**
 * Convert a Type to a Supplier
 * @param type the type to convert
 * @param <T> the type of value supplied
 * @returns a Supplier that supplies values of type T
 */
export function fromType<T>(type: Type<T>): RequiredType<Supplier<T>> {
  if (guard(type)) {
    return type;
  } else if (isFunction(type)) {
    return {
      supply: type
    }
  } else {
    return {
      supply: () => type
    }
  }
}

/**
 * Get the value from a Supplier Type
 * 
 * @param type the Supplier Type
 * @param <T> the type of value supplied
 * @returns the value supplied by the Supplier Type
 */
export function toValue<T>(type: Type<T>): T {
  if (guard(type)) {
    return type.supply();
  } else if (isFunction(type)) {
    return type();
  } else {
    return type;
  }
}

/**
 * Check that a Supplier is present
 *
 * @param supplier the supplier to check
 * @return the supplier if present
 * @throws IllegalArgumentException if the supplier is not present
 */
export function check<T>(supplier: Type<T>): Type<T> {
  return presentCheck(supplier, "Supplier must be Present.");
}