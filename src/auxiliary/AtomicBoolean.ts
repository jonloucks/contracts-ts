import { OptionalType, hasFunctions } from "@jonloucks/contracts-ts/api/Types";

/**
 * Responsibility: An atomic boolean interface for thread-safe boolean operations.
 */
export interface AtomicBoolean {

    /**
     * Get the current boolean value.
     */
    get(): boolean;

    /**
     * Set the current boolean value.
     * @param newValue the new value
     */
    set(newValue: boolean): void;

    /**
     * Atomically set the value to the given updated value if the current value === the expected value.
     * 
     * @param expectedValue the expected current value
     * @param newValue the requested new value 
     * @return true if successful. False return indicates that the actual value was not equal to the expected value.
     */
    compareAndSet(expectedValue: boolean, newValue: boolean): boolean;

    /**
     * Helpful method for converting to primitive types.
     * @param hint 
     */
    [Symbol.toPrimitive](hint: string): string | boolean | number;
}

/**
 * Type guard for AtomicBoolean interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AtomicBoolean
 */
export function guard(instance: unknown): instance is OptionalType<AtomicBoolean> {
    return hasFunctions(instance, "compareAndSet", "get", "set");
}


