import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@jonloucks/contracts-ts/api/Lawyer";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
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

/** @deprecated use guard instead
 */
export { guard as isAtomicBoolean }

/**
 * For creating a Contract for AtomicBoolean with duck-typing checks.
 * @deprecated create a contract using typeGuard directly
 */
export const LAWYER: Lawyer<AtomicBoolean> = new class implements Lawyer<AtomicBoolean> {

    /** 
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends AtomicBoolean>(instance: unknown): instance is OptionalType<X> {
        return guard(instance);
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends AtomicBoolean>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "AtomicBoolean";

        return createContract<X>(copy);
    }
};



