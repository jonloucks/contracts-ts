/**
 * Types and type guards for API
 */

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
  transform(I: OptionalType<I>): OptionalType<O>;
}

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
export function isFunctionPresent<T extends UnknownFunction>(value: unknown): value is RequiredType<T> {
  return _typeOfPresent(value, "function");
}

/**
 * Check if given value is a function or null/undefined
 * @param value the value to check
 * @returns true if value is a function
 */
export function isFunction(value: unknown): value is OptionalType<UnknownFunction> {
  return _isTypeOf(value, "function");
}

/**
 * Check if given value is an object and is not null or undefined
 * @param value the value to check
 * @returns true if value is an object and is not null or undefined
 */
export function isObjectPresent(value: unknown): value is RequiredType<object> {
  return _typeOfPresent(value, "object");
}

/**
 * Check if given value is an object or null/undefined
 * @param value the value to check
 * @returns true if value is an object
 */
export function isObject(value: unknown): value is OptionalType<object> {
  return _isTypeOf(value, "object");
}

/**
 * Check if given value is a string and is not null or undefined
 * @param value the value to check
 * @returns true if value is a string and is not null or undefined
 */
export function isStringPresent(value: unknown): value is RequiredType<string> {
  return _typeOfPresent(value, "string");
}

/**
 * Check if given value is a string or null/undefined
 * @param value the value to check
 * @returns true if value is a string
 */
export function isString(value: unknown): value is OptionalType<string> {
  return _isTypeOf(value, "string");
}

/**
 * Check if given value is a number and is not null or undefined
 * @param value the value to check
 * @returns true if value is a number and is not null or undefined
 */
export function isNumberPresent(value: unknown): value is RequiredType<number> {
  return _typeOfPresent(value, "number");
}

/**
 * Check if given value is a number or null/undefined
 * @param value the value to check
 * @returns true if value is a number
 */
export function isNumber(value: unknown): value is OptionalType<number> {
  return _isTypeOf(value, "number");
}

/**
 * Check if given value is a symbol and is not null or undefined
 * @param value the value to check
 * @returns true if value is a symbol and is not null or undefined
 */
export function isSymbolPresent(value: unknown): value is RequiredType<symbol> {
  return _typeOfPresent(value, "symbol");
}

/**
 * Check if given value is a symbol or null/undefined
 * @param value the value to check
 * @returns true if value is a symbol
 */
export function isSymbol(value: unknown): value is OptionalType<symbol> {
  return _isTypeOf(value, "symbol");
}

/**
 * Check if given value is a boolean and is not null or undefined
 * @param value the value to check
 * @returns true if value is a boolean and is not null or undefined
 */
export function isBooleanPresent(value: unknown): value is RequiredType<boolean> {
  return _typeOfPresent(value, "boolean");
}

/**
* Check if given value is a boolean or null/undefined
 * @param value the value to check
 * @returns true if value is a boolean
 */
export function isBoolean(value: unknown): value is OptionalType<boolean> {
  return _isTypeOf(value, "boolean");
}

/**
 * Check if given value is a bigint and is not null or undefined
 * @param value the value to check
 * @returns true if value is a bigint and is not null or undefined
 */
export function isBigIntPresent(value: unknown): value is RequiredType<bigint> {
  return _typeOfPresent(value, "bigint");
}

/**
 * Check if given value is a bigint or null/undefined
 * @param value the value to check
 * @returns true if value is a bigint
 */
export function isBigInt(value: unknown): value is OptionalType<bigint> {
  return _isTypeOf(value, "bigint");
}

/**
 * Check if given value is a constructor and is not null or undefined
 * @param value the value to check
 * @returns true if value is a constructor and is not null or undefined
 */
export function isConstructorPresent<T>(value: unknown): value is RequiredType<(new () => T)> {
  return isFunctionPresent(value) && 'prototype' in value && 'constructor' in value
}

/**
 * Check if given value is a constructor or null/undefined
 * @param value the value to check
 * @returns true if value is a constructor
 */
export function isConstructor<T>(value: unknown): value is OptionalType<(new () => T)> {
  return isNotPresent(value) || isConstructorPresent<T>(value);
}

/**
 * Check if given value has defined properties
 * Note: if the value is present is required to have all the functions defined
 * 
 * @param value the value to check
 * @param propertyNames the property names to check
 * @returns true if property is defined
 */
export function hasFunctions(value: unknown, ...propertyNames: (string | symbol)[]): value is RequiredType<UnknownFunction> {
  return _hasFunctions(value, propertyNames, false);
}

/**
 * Check if given value has defined properties
 * 
 * @param value the value to check
 * @param propertyNames the property names to check
 * @returns true if property is defined
 */
export function hasFunctionsPresent(value: unknown, ...propertyNames: (string | symbol)[]): value is RequiredType<UnknownFunction> {
  return _hasFunctions(value, propertyNames, true);
}

function _isTypeOf<T>(value: unknown, type: string): value is OptionalType<T> {
  return isNotPresent(value) || _typeOfPresent(value, type);
}

function _typeOfPresent<T>(value: unknown, type: string): value is RequiredType<T> {
  return isPresent(value) && typeof value === type;
}

function _hasFunctions(value: unknown, propertyNames: (string | symbol)[], required: boolean): boolean {
  if (isNotPresent(value)) {
    return !required;
  }
  const record = value as Record<string | symbol, unknown>;
  for (const propertyName of propertyNames) {
    if (!isFunctionPresent(record[propertyName])) {
      return false;
    }
  }
  return true;
}
