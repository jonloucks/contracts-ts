import { OptionalType, hasFunctions } from "./Types";
import { Contract, Config as ContractConfig } from "./Contract";
import { Lawyer } from "./Lawyer";

/**
 * Responsibility: An atomic reference interface for thread-safe reference operations.
 * Note: typescript limitations prevent full atomicity guarantees.
 */
export interface AtomicReference<T> {

    get(): OptionalType<T>;

    set(newValue: OptionalType<T>): void

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

        return Contract.create<X>(copy);
    }
}