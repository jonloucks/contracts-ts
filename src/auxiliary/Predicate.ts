/**
 * Predicate.ts
 * 
 * Defines a Predicate type that can test values of type T.
 */

import { guardFunctions, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { presentCheck, used } from "@jonloucks/contracts-ts/auxiliary/Checks";

/** 
 * A method that tests a value of type T and returns a boolean
 */
export type Method<T> = (value: T) => boolean;

/** 
 * A Predicate that tests values of type T
 */
export interface Predicate<T> { test(value: T): boolean; }

/** 
 * A type that can be a Method, Predicate, or a boolean
 */
export type Type<T> = Method<T> | Predicate<T> | boolean;

/**
 * Duck type guard check for Predicate
 * 
 * @param instance the instance to check
 * @param <T> the type of value tested
 * @returns true if instance is a Predicate, false otherwise
 */
export function guard<T>(instance: unknown): instance is Predicate<T> {
  return guardFunctions(instance, 'test');
}

/**
 * Convert a Type to a Predicate
 * 
 * @param type the type to convert
 * @param <T> the type of value tested
 * @returns a Predicate that tests values of type T
 */
export function fromType<T>(type: Type<T>): Predicate<T> {
  if (guard(type)) {
    return type;
  } else if (typeof type === 'boolean') {
    return {
      test: (value: T) : boolean => {
        used(value);
        return type;
      }
    };
  } else {
    return {
      test: type
    };
  }
}

/**
 * Test a value against a Predicate Type
 * 
 * @param type the Predicate Type
 * @param value the value to test
 * @param <T> the type of value tested
 * @returns true if the value satisfies the Predicate, false otherwise
 */
export function toValue<T>(type: Type<T>, value: T): boolean {
  if (guard(type)) {
    return type.test(value);
  } else if (typeof type === 'boolean') {
    return type;
  } else {
    return type(value);
  }
}

/**
 * Check that a predicate is present
 *
 * @param predicate the predicate to check
 * @return the predicate if present
 * @throws IllegalArgumentException if the predicate is not present
 */
export function check<T>(predicate: OptionalType<Predicate<T>>): RequiredType<Predicate<T>> {
  return presentCheck(predicate, "Predicate must be Present.");
}