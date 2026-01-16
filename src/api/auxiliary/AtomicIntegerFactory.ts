import { AtomicInteger } from "@io.github.jonloucks/contracts-ts/api/auxiliary/AtomicInteger";
import { OptionalType, RequiredType, hasFunctions } from "@io.github.jonloucks/contracts-ts/api/auxiliary/Types";
import { Contract, Config as ContractConfig } from "@io.github.jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@io.github.jonloucks/contracts-ts/api/Lawyer";
import { create as createContract } from "@io.github.jonloucks/contracts-ts/api/RatifiedContract";

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
 * For creating a Contract for AtomicInteger with duck-typing checks.
 */
export const LAWYER: Lawyer<AtomicIntegerFactory> = new class implements Lawyer<AtomicIntegerFactory> {

    /** 
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends AtomicIntegerFactory>(instance: unknown): instance is OptionalType<X> {
        return hasFunctions(instance, 'create');
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
export const CONTRACT: Contract<AtomicIntegerFactory> = LAWYER.createContract();