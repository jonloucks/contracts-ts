import { Contract, Config as ContractConfig } from "contracts-ts/api/Contract";
import { Lawyer } from "contracts-ts/api/Lawyer";
import { create as createContract } from "contracts-ts/api/RatifiedContract";
import { OptionalType, hasFunctions } from "contracts-ts/api/Types";

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
 * For creating a Contract for AtomicInteger with duck-typing checks.
 */
export const LAWYER: Lawyer<AtomicInteger> = new class implements Lawyer<AtomicInteger> {
 
    /** 
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends AtomicInteger>(instance: unknown): instance is OptionalType<X> {
        return hasFunctions(instance, "compareAndSet", "incrementAndGet", "decrementAndGet", "get", "set");
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends AtomicInteger>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "AtomicInteger";

        return createContract<X>(copy);
    }
};

