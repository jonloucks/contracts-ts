import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@jonloucks/contracts-ts/api/Lawyer";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { OptionalType, RequiredType, hasFunctions } from "@jonloucks/contracts-ts/api/Types";
import { AtomicInteger } from "@jonloucks/contracts-ts/auxiliary/AtomicInteger";

/**
 * Factory interface for creating AtomicInteger instances.
 */
export interface AtomicIntegerFactory {

    /**
     * Create a new AtomicInteger instance.    
     * @param initialValue the initial value of the AtomicInteger
     */
    create(initialValue?: number): RequiredType<AtomicInteger>;
}

/**
 * Type guard for AtomicIntegerFactory interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AtomicIntegerFactory
 */
export function guard(instance: unknown): instance is OptionalType<AtomicIntegerFactory> {
    return hasFunctions(instance, 'create');
}

/** @deprecated use guard instead
 */
export { guard as isAtomicIntegerFactory }

/**
 * For creating a Contract for AtomicInteger with duck-typing checks.
 * @deprecated use createContract instead with guard
 */
export const LAWYER: Lawyer<AtomicIntegerFactory> = new class implements Lawyer<AtomicIntegerFactory> {

    /** 
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends AtomicIntegerFactory>(instance: unknown): instance is OptionalType<X> {
        return guard(instance);
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends AtomicIntegerFactory>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "AtomicIntegerFactory";

        return createContract<X>(copy);
    }
};

/**
 * The factory Contract for creating new AtomicInteger instances.
 */
export const CONTRACT: Contract<AtomicIntegerFactory> = createContract({
    test: guard,
    name: "AtomicIntegerFactory"
});