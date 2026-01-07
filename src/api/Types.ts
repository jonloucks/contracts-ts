export type OptionalType<T> = T | null | undefined;
export type RequiredType<T> = NonNullable<T>;
export type OptionalSupplierType<T> = () => OptionalType<T>;
export type RequiredSupplierType<T> = () => RequiredType<T>;
export type AnyFunction = (...args: any[]) => any;

export interface Transform<I, O> {
   transform(I: OptionalType<I>): OptionalType<O>;
}

/**
 * Check iif given value is not null or undefined
 * 
 * @param value the value to check
 * @returns true iif value is not null or undefined, false for actual values
 */
export function isNotNullOrUndefined<T>(value: any): value is RequiredType<T> {
    return value !== null && value !== undefined;
}

/**
 * Check iif given value is null or undefined
 * 
 * @param value the value to check
 * @returns true iif value is null or undefined, false for actual values
 */
export function isNullOrUndefined<T>(value: any): value is OptionalType<T> {
    return value === null || value === undefined;
}

export function isRequiredFunction<T extends AnyFunction>(value: any): value is RequiredType<T>{
    return isRequiredTypeOf(value, "function");
}

export function isFunction(value: any): value is OptionalType<AnyFunction>{
    return isTypeOf(value, "function");
}

export function isRequiredObject(value: any): value is RequiredType<object> {
    return isRequiredTypeOf(value, "object");
}

export function isObject(value: any): value is OptionalType<object> {
    return isTypeOf(value, "object");
}

export function isRequiredString(value: any): value is RequiredType<string> {
    return isRequiredTypeOf(value, "string");
}

export function isString(value: any): value is OptionalType<string> {
    return isTypeOf(value, "string");
}

export function isRequiredNumber(value: any): value is RequiredType<number> {
    return isRequiredTypeOf(value, "number");
}

export function isNumber(value: any): value is OptionalType<number> {
    return isTypeOf(value, "number");
}

export function isRequiredSymbol(value: any): value is RequiredType<symbol> {
    return isRequiredTypeOf(value, "symbol");
}

export function isSymbol(value: any): value is OptionalType<symbol> {
    return isTypeOf(value, "symbol");
}

export function isRequiredBoolean(value: any): value is RequiredType<boolean> {
    return isRequiredTypeOf(value, "boolean");
}

export function isBoolean(value: any): value is OptionalType<boolean> {
    return isTypeOf(value, "boolean");
}

export function isRequiredBigInt(value: any): value is RequiredType<bigint> {
    return isRequiredTypeOf(value, "bigint");
}

export function isBigInt(value: any): value is OptionalType<bigint> {
    return isTypeOf(value, "bigint");
}

export function isRequiredConstructor<T>(value: any): value is RequiredType<(new () => T)> {
    return isRequiredFunction(value) && !!(value as any).prototype && !!(value as any).prototype.constructor;
}

export function isConstructor<T>(value: any): value is RequiredType<(new () => T)> {
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
export function hasFunctions(value: any, ...propertyNames: string[]): value is RequiredType<AnyFunction> {
    return hasFunctionsHelper(value, propertyNames, false);
}

/**
 * Check if given value has defined properties
 * 
 * @param value the value to check
 * @param propertyNames the property names to check
 * @returns true if property is defined
 */
export function hasRequiredFunctions(value: any, ...propertyNames: string[]):  value is RequiredType<AnyFunction>{
    return hasFunctionsHelper(value, propertyNames, true);
}

function isTypeOf(value: any, type: string): value is OptionalType<any> {
      return isNullOrUndefined(value) || isRequiredTypeOf(value, type);
}

function isRequiredTypeOf(value: any, type: string): value is RequiredType<any> {
    return typeof value === type;
}

function hasFunctionsHelper(value: any, propertyNames: string[], required: boolean): boolean {
    if (isNullOrUndefined(value)) {
        return !required;
    }
    for (const propertyName of propertyNames) {
        if (!isRequiredFunction(value[propertyName])) {
            return false;
        }
    }
    return true;
}
