import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { OptionalType, RequiredType, guardFunctions } from "@jonloucks/contracts-ts/api/Types";
import { AtomicReference } from "@jonloucks/contracts-ts/auxiliary/AtomicReference";

/**
 * Factory interface for creating AtomicReference instances.
 */
export interface AtomicReferenceFactory {

    /**
     * Create a new AtomicReference instance.    
     * @param initialValue the initial value of the AtomicReference
     */
    createAtomicReference<T>(initialValue?: OptionalType<T>): RequiredType<AtomicReference<T>>;
}

/**
 * Type guard for AtomicReferenceFactory interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AtomicReferenceFactory
 */
export function guard(instance: unknown): instance is RequiredType<AtomicReferenceFactory> {
    return guardFunctions(instance, "createAtomicReference");
}

/**
 * The factory Contract for creating new AtomicReference instances.
 */
export const CONTRACT: Contract<AtomicReferenceFactory> = createContract({
    test: guard,
    name: "AtomicReferenceFactory"
});
