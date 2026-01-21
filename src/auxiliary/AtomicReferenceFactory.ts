import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@jonloucks/contracts-ts/api/Lawyer";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { OptionalType, RequiredType, hasFunctions } from "@jonloucks/contracts-ts/api/Types";
import { AtomicReference } from "@jonloucks/contracts-ts/auxiliary/AtomicReference";

/**
 * Factory interface for creating AtomicReference instances.
 */
export interface AtomicReferenceFactory {

    /**
     * Create a new AtomicReference instance.    
     * @param initialValue the initial value of the AtomicReference
     */
    create<T>(intialValue?: OptionalType<T>): RequiredType<AtomicReference<T>>;
}

/**
 * Type guard for AtomicReferenceFactory interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AtomicReferenceFactory
 */
export function guard(instance: unknown): instance is OptionalType<AtomicReferenceFactory> {
    return hasFunctions(instance, "create");
}

/** @deprecated use guard instead
 */
export { guard as isAtomicReferenceFactory }
/**
 * For creating a Contract for AtomicReferenceFactory with duck-typing checks.
 * @deprecated use createContract with guard instead
 */
export const LAWYER: Lawyer<AtomicReferenceFactory> = new class implements Lawyer<AtomicReferenceFactory> {

    /**
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends AtomicReferenceFactory>(instance: unknown): instance is OptionalType<X> {
        return guard(instance);
    }

    /**
     * Lawyer.createContract override
     */
    createContract<X extends AtomicReferenceFactory>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "AtomicReferenceFactory";

        return createContract<X>(copy);
    }
}

/**
 * The factory Contract for creating new AtomicReference instances.
 */
export const CONTRACT: Contract<AtomicReferenceFactory> = createContract({
    test: guard,
    name: "AtomicReferenceFactory"
});
