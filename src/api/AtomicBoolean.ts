import { OptionalType, hasFunctions } from "./Types";
import { Contract, Config as ContractConfig } from "./Contract";
import { Lawyer } from "./Lawyer";

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
 * For creating a Contract for AtomicBoolean with duck-typing checks.
 */
export const LAWYER: Lawyer<AtomicBoolean> = new class implements Lawyer<AtomicBoolean> {

    /** 
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends AtomicBoolean>(instance: unknown): instance is OptionalType<X> {
        return hasFunctions(instance, "compareAndSet", "get", "set");
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends AtomicBoolean>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "AtomicBoolean";

        return Contract.create<X>(copy);
    }
};



