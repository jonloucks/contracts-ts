import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { RequiredType, guardFunctions } from "@jonloucks/contracts-ts/api/Types";
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
export function guard(instance: unknown): instance is RequiredType<AtomicIntegerFactory> {
    return guardFunctions(instance, 'create');
}

/**
 * The factory Contract for creating new AtomicInteger instances.
 */
export const CONTRACT: Contract<AtomicIntegerFactory> = createContract({
    test: guard,
    name: "AtomicIntegerFactory"
});