import { OptionalType, hasFunctions } from "./Types";
import { Contract, Config as ContractConfig } from "./Contract";
import { Lawyer } from "./Lawyer";
import { create as createContract } from "./RatifiedContract";

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
 * For creating a Contract for AtomicReference with duck-typing checks.
 */
export const LAWYER: Lawyer<AtomicReference<unknown>> = new class implements Lawyer<AtomicReference<unknown>> {

    /** 
     * Lawyer.isDeliverable override 
     */
    isDeliverable<X extends AtomicReference<unknown>>(instance: unknown): instance is OptionalType<X> {
        return hasFunctions(instance, "compareAndSet", "get", "set");
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