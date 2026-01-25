import { OptionalType, RequiredType, guardFunctions } from "@jonloucks/contracts-ts/api/Types";

/**
 * Responsibility: An atomic reference interface for thread-safe reference operations.
 * Note: typescript limitations prevent full atomicity guarantees.
 */
export interface AtomicReference<T> {

    /**
     * Get the current reference value.
     */
    get(): OptionalType<T>;

    /**
     * Set the current reference value.
     * @param newValue the new reference value
     */
    set(newValue: OptionalType<T>): void

    /**
     * Atomically sets the value to the given updated value if the current value == the expected value.
     * @param expectedValue the expected current value
     * @param newValue the requested new value
     * @return true if successful. False return indicates that the actual value was not equal to the expected value.
     */
    compareAndSet(expectedValue: OptionalType<T>, newValue: OptionalType<T>): boolean;

    /**
     * Atomically sets to the given value and returns the previous value.
     * 
     * @param newValue the new value
     * @return the previous value
     */
    getAndSet(newValue: OptionalType<T>): OptionalType<T>;
}

/**
 * Type guard for AtomicReference interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AtomicReference
 */
export function guard<T>(instance: unknown): instance is RequiredType<AtomicReference<T>> {
    return guardFunctions(instance, "compareAndSet", "getAndSet", "get", "set");
}
