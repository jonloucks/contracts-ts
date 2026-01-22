import { RequiredType, guardFunctions } from "@jonloucks/contracts-ts/api/Types";

/**
 * Responsibility: An atomic integer interface for thread-safe integer operations.
 */
export interface AtomicInteger {

    /**
     * Get the current integer value.
     */
    get(): number;

    /**
     * Set the current integer value.
     * @param value the new value
     */
    set(value: number): void;

    /**
     * Atomically sets the value to the given updated value if the current value == the expected value.
     * @param expectedValue the expected current value
     * @param newValue the requested new value 
     * @return true if successful. False return indicates that the actual value was not equal to the expected value.
     */
    compareAndSet(expectedValue: number, newValue: number): boolean;

    /**
     * Atomically increments the current value by one.
     * @return the updated value
     */
    incrementAndGet(): number;

    /**
     * Atomically decrements the current value by one.
     * @return the updated value
     */
    decrementAndGet(): number;

    /**
     * Helpful method for converting to primitive types.
     * @param hint primitive hint
     */
    [Symbol.toPrimitive](hint: string): string | number | boolean;
}

/**
 * Type guard for AtomicInteger interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AtomicInteger
 */
export function guard(instance: unknown): instance is RequiredType<AtomicInteger> {
    return guardFunctions(instance, "compareAndSet", "incrementAndGet", "decrementAndGet", "get", "set");
}
