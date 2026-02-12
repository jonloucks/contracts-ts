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
 * Type that can be undefined or a value of type T
 */
export type UndefinedType<T> = T | undefined;

/**
 * A function of unknown signature
 */
export type UnknownFunction = (...args: unknown[]) => unknown;

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
export function guardFunctions<T>(value: unknown, ...propertyNames: (string | symbol)[]): value is RequiredType<T & object> {
  if (isObject(value) === false) {
    return false;
  }

  for (const propertyName of propertyNames) {
    if (hasFunction(value, propertyName) === false) {
      return false;
    }
  }

  return true;
}

/**
 * Check if given value has a function defined for the given property name
 * Note: if the value is present is required to have the function defined
 * 
 * @param value the value to check
 * @param propertyName the property name to check
 * @returns true if property is defined as a function or getter/setter, false otherwise
 */
export function hasFunction<T>(value: unknown, propertyName: string | symbol): value is RequiredType<T & object> {
  const descriptor: PropertyDescriptor | undefined = getPropertyDescriptor(value, propertyName);
  if (isNotPresent(descriptor)) {
    return false;
  }
  if (isPresent(descriptor.get) || isPresent(descriptor.set)) {
    return true; // getter/setter is ok
  }
  if (isFunction(descriptor.value)) {
    return true; // function is ok
  }
  return false; // not a function or getter/setter
}

function getPropertyDescriptor(instance: unknown, name: string | symbol): PropertyDescriptor | undefined {
  let focus: unknown = instance;
  while (isObject(focus)) {
    const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(focus, name);
    if (isPresent(descriptor)) {
      return descriptor;
    }
    focus = Object.getPrototypeOf(focus);
  }
  return undefined;
}