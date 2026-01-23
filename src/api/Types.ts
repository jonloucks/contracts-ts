/**
 * Types and type guards for API
 */

import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { IllegalArgumentException } from "@jonloucks/contracts-ts/auxiliary/IllegalArgumentException";

/**
 * Type that can be null or undefined
 */
export type OptionalType<T> = T | null | undefined;

/**
 * Type that is guaranteed to be non-null and non-undefined
 */
export type RequiredType<T> = NonNullable<T>;

/**
 * A function of unknown signature
 */
export type UnknownFunction = (...args: unknown[]) => unknown;

/**
 * A transformation from type I to type O
 */
export interface Transform<I, O> {
  transform(input: I): O;
}

/**
 * A function that transforms type I to type O
 */
export type TransformFunction<I, O> = (input: I) => O;

/**
 * A transformation type that can be a Transform or a function form type I to type O
 */
export type TransformType<I, O> = Transform<I, O> | TransformFunction<I, O>;

/**
 * Check iif given value is not null or undefined
 * 
 * @param value the value to check
 * @returns true iif value is not null or undefined, false for actual values
 */
export function isPresent<T>(value: unknown): value is RequiredType<T> {
  return value !== null && value !== undefined;
}

/**
 * Check iif given value is null or undefined
 * 
 * @param value the value to check
 * @returns true iif value is null or undefined, false for actual values
 */
export function isNotPresent(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if given value is a function and is not null or undefined
 * @param value the value to check
 * @returns true if value is a function and is not null or undefined
 */
export function isFunction<T extends UnknownFunction>(value: unknown): value is RequiredType<T> {
  return isPresent(value) && typeof value === "function";
}

/**
 * Check if given value is a function with the given arity
 * 
 * @param value the value to check
 * @param arity the arity to check
 * @returns true if value is a function with the given arity
 */
export function isFunctionWithArity<T extends UnknownFunction>(value: unknown, arity: number): value is RequiredType<T> {
  return isFunction<T>(value) && value.length === arity;
}

/**
 * Check if given value is an object and is not null or undefined
 * @param value the value to check
 * @returns true if value is an object and is not null or undefined
 */
export function isObject(value: unknown): value is RequiredType<object> {
  return isPresent(value) && typeof value === "object";
}

/**
 * Check if given value is a string 
 * 
 * @param value the value to check
 * @returns true if value is a string
 */
export function isString(value: unknown): value is RequiredType<string> {
  return isPresent(value) && typeof value === "string";
}

/**
 * Check if given value is a number and is not null or undefined
 * @param value the value to check
 * @returns true if value is a number and is not null or undefined
 */
export function isNumber(value: unknown): value is RequiredType<number> {
  return isPresent(value) && typeof value === "number";
}

/**
 * Check if given value is a symbol and is not null or undefined
 * @param value the value to check
 * @returns true if value is a symbol and is not null or undefined
 */
export function isSymbol(value: unknown): value is RequiredType<symbol> {
  return isPresent(value) && typeof value === "symbol";
}

/**
 * Check if given value is a boolean and is not null or undefined
 * @param value the value to check
 * @returns true if value is a boolean and is not null or undefined
 */
export function isBoolean(value: unknown): value is RequiredType<boolean> {
  return isPresent(value) && typeof value === "boolean";
}

/**
 * Check if given value is a bigint and is not null or undefined
 * @param value the value to check
 * @returns true if value is a bigint and is not null or undefined
 */
export function isBigInt(value: unknown): value is RequiredType<bigint> {
  return isPresent(value) && typeof value === "bigint";
}

/**
 * Check if given value is a constructor and is not null or undefined
 * @param value the value to check
 * @returns true if value is a constructor and is not null or undefined
 */
export function isConstructor<T>(value: unknown): value is RequiredType<(new () => T)> {
  return isFunction(value) && 'prototype' in value && 'constructor' in value;
}

/**
 * Check if given value has defined properties
 * Note: if the value is present is required to have all the functions defined
 * 
 * @param value the value to check
 * @param propertyNames the property names to check
 * @returns true if property is defined
 */
export function guardFunctions(value: unknown, ...propertyNames: (string | symbol)[]): value is RequiredType<UnknownFunction> {
  if (isNotPresent(value)) {
    return false;
  }
  const record = value as Record<string | symbol, unknown>;
  for (const propertyName of propertyNames) {
    if (!isFunction(record[propertyName])) {
      return false;
    }
  }
  return true;
}

function guardTransform<I, O>(transform: unknown): transform is Transform<I, O> {
  return guardFunctions(transform, 'transform');
}

function guardTransformFunction<I, O>(transform: unknown): transform is TransformFunction<I, O> {
  return isFunctionWithArity(transform, 1);
} 

/**
 * Convert a TransformType to a Transform
 * 
 * @param transform the TransformType to convert
 * @returns the Transform
 */
export function typeToTransform<I, O>(transform: TransformType<I, O>): RequiredType<Transform<I, O>> {
  const validTransformType = presentCheck(transform, "TransformType must be present.");
  if (guardTransform<I, O>(validTransformType)) {
    return validTransformType;
  } else if (guardTransformFunction<I, O>(validTransformType)) {
    return { transform: validTransformType };  
  } else {
    throw new IllegalArgumentException("TransformType must be a Transform or a function taking one argument.");
  }
}

