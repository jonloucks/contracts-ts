import { AtomicBoolean } from "contracts-ts/api/auxiliary/AtomicBoolean";
import { OptionalType, RequiredType, hasFunctions } from "contracts-ts/api/auxiliary/Types";
import { Contract, Config as ContractConfig } from "contracts-ts/api/Contract";
import { Lawyer } from "contracts-ts/api/Lawyer";
import { create as createContract } from "contracts-ts/api/RatifiedContract";

/**
 * Factory interface for creating AtomicBoolean instances.
 */
export interface AtomicBooleanFactory {

    /**
     * Create a new AtomicBoolean instance.    
     * @param initialValue the initial value of the AtomicBoolean
     */
    create(initialValue?: boolean): RequiredType<AtomicBoolean>;
}

/**
 * For creating a Contract for AtomicBoolean with duck-typing checks.
 */
export const LAWYER: Lawyer<AtomicBooleanFactory> = new class implements Lawyer<AtomicBooleanFactory> {

    /** 
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends AtomicBooleanFactory>(instance: unknown): instance is OptionalType<X> {
        return hasFunctions(instance, "create");
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends AtomicBooleanFactory>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "AtomicBooleanFactory";

        return createContract<X>(copy);
    }
};

/**
 * The factory Contract for creating new AtomicBoolean instances.
 */
export const CONTRACT: Contract<AtomicBooleanFactory> = LAWYER.createContract();

