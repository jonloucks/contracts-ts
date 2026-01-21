import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@jonloucks/contracts-ts/api/Lawyer";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { OptionalType, hasFunctions } from "@jonloucks/contracts-ts/api/Types";

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
}

/**
 * Type guard for AtomicReference interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AtomicReference
 */
export function guard<T>(instance: unknown): instance is OptionalType<AtomicReference<T>> {
    return hasFunctions(instance, "compareAndSet", "get", "set");
}

/** @deprecated use guard instead
 */
export { guard as isAtomicReference }

/**
 * For creating a Contract for AtomicReference with duck-typing checks.
 * @deprecated create a contract using typeGuard directly
 */
export const LAWYER: Lawyer<AtomicReference<unknown>> = new class implements Lawyer<AtomicReference<unknown>> {

    /** 
     * Lawyer.isDeliverable override 
     */
    isDeliverable<X extends AtomicReference<unknown>>(instance: unknown): instance is OptionalType<X> {
        return guard(instance);
    }

    /** 
     * Lawyer.createContract override 
     */
    createContract<X extends AtomicReference<unknown>>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "AtomicReference";

        return createContract<X>(copy);
    }
}