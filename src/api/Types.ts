export type OptionalType<T> = T | null | undefined;
export type RequiredType<T> = NonNullable<T>;
export type UnknownFunction = (...args: unknown[]) => unknown;

export interface Transform<I, O> {
   transform(I: OptionalType<I>): OptionalType<O>;
}

/**
 * Check iif given value is not null or undefined
 * 
 * @param value the value to check
 * @returns true iif value is not null or undefined, false for actual values
 */
export function isNotNullOrUndefined<T>(value: unknown): value is RequiredType<T> {
    return value !== null && value !== undefined;
}

/**
 * Check iif given value is null or undefined
 * 
 * @param value the value to check
 * @returns true iif value is null or undefined, false for actual values
 */
export function isNullOrUndefined<T>(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

export function isRequiredFunction<T extends UnknownFunction>(value: unknown): value is RequiredType<T>{
    return isRequiredTypeOf(value, "function");
}

export function isFunction(value: unknown): value is OptionalType<UnknownFunction>{
    return isTypeOf(value, "function");
}

export function isRequiredObject(value: unknown): value is RequiredType<object> {
    return isRequiredTypeOf(value, "object");
}

export function isObject(value: unknown): value is OptionalType<object> {
    return isTypeOf(value, "object");
}

export function isRequiredString(value: unknown): value is RequiredType<string> {
    return isRequiredTypeOf(value, "string");
}

export function isString(value: unknown): value is OptionalType<string> {
    return isTypeOf(value, "string");
}

export function isRequiredNumber(value: unknown): value is RequiredType<number> {
    return isRequiredTypeOf(value, "number");
}

export function isNumber(value: unknown): value is OptionalType<number> {
    return isTypeOf(value, "number");
}

export function isRequiredSymbol(value: unknown): value is RequiredType<symbol> {
    return isRequiredTypeOf(value, "symbol");
}

export function isSymbol(value: unknown): value is OptionalType<symbol> {
    return isTypeOf(value, "symbol");
}

export function isRequiredBoolean(value: unknown): value is RequiredType<boolean> {
    return isRequiredTypeOf(value, "boolean");
}

export function isBoolean(value: unknown): value is OptionalType<boolean> {
    return isTypeOf(value, "boolean");
}

export function isRequiredBigInt(value: unknown): value is RequiredType<bigint> {
    return isRequiredTypeOf(value, "bigint");
}

export function isBigInt(value: unknown): value is OptionalType<bigint> {
    return isTypeOf(value, "bigint");
}

export function isRequiredConstructor<T>(value: unknown): value is RequiredType<(new () => T)> {
    return isRequiredFunction(value) &&'prototype' in value && 'constructor' in value
}

export function isConstructor<T>(value: unknown): value is RequiredType<(new () => T)> {
   return isNullOrUndefined(value) || isRequiredConstructor<T>(value);
}

/**
 * Check if given value has defined properties
 * Note: if the value is present is required to have all the functions defined
 * 
 * @param value the value to check
 * @param propertyNames the property names to check
 * @returns true if property is defined
 */
export function hasFunctions(value: unknown, ...propertyNames: string[]): value is RequiredType<UnknownFunction> {
    return hasFunctionsHelper(value, propertyNames, false);
}

/**
 * Check if given value has defined properties
 * 
 * @param value the value to check
 * @param propertyNames the property names to check
 * @returns true if property is defined
 */
export function hasRequiredFunctions(value: unknown, ...propertyNames: string[]):  value is RequiredType<UnknownFunction>{
    return hasFunctionsHelper(value, propertyNames, true);
}

function isTypeOf<T>(value: unknown, type: string): value is OptionalType<T> {
      return isNullOrUndefined(value) || isRequiredTypeOf(value, type);
}

function isRequiredTypeOf<T>(value: unknown, type: string): value is RequiredType<T> {
    return typeof value === type;
}

function hasFunctionsHelper(value: unknown, propertyNames: string[], required: boolean): boolean {
    if (isNullOrUndefined(value)) {
        return !required;
    }
    const record = value as Record<string, unknown>;
    for (const propertyName of propertyNames) {
        if (!isRequiredFunction(record[propertyName])) {
            return false;
        }
    }
    return true;
}
