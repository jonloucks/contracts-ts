/**
 * Consumer.ts
 * Candidate for inclusion in api-ts
 * Defines a Consumer type that can consume values of type T.
 */

import { guardFunctions, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

/** 
 * A method that consumes a value of type T
 */
export type Method<T> = (value: T) => void;

/** 
 * A Consumer that consumes values of type T
 */
export interface Consumer<T> { consume(value: T): void; }

/** 
 * A type that can be either a Method or a Consumer
 */
export type Type<T> = Method<T> | Consumer<T>;

/**
 * Duck type guard check for Consumer
 * 
 * @param instance the instance to check
 * @param <T> the type of value consumed
 * @returns true if instance is a Consumer, false otherwise
 */
export function guard<T>(instance: unknown): instance is RequiredType<Consumer<T>> {
  return guardFunctions(instance, 'consume');
}

/**
 * Convert a Type to a Consumer
 * 
 * @param type the type to convert
 * @param <T> the type of value consumed
 * @returns a Consumer that consumes values of type T
 */
export function fromType<T>(type: Type<T>): RequiredType<Consumer<T>> {
  if (guard(type)) {
    return type;
  } else {
    return {
      consume: type
    };
  }
}

/**
 * Check that a Consumer is present
 *
 * @param consumer the consumer to check
 * @return the consumer if present
 * @throws IllegalArgumentException if the consumer is not present
 */
export function check<T>(consumer: Type<T>): Type<T> {
  return presentCheck(consumer, "Consumer must be present.");
}