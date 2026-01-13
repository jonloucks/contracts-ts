import { Contract, Config as ContractConfig } from "contracts-ts/api/Contract";
import { Lawyer } from "contracts-ts/api/Lawyer";
import { create as createContract } from "contracts-ts/api/RatifiedContract";
import { Repository } from "contracts-ts/api/Repository";
import { OptionalType, RequiredType, hasFunctions } from "contracts-ts/api/Types";

/**
 * Factory interface for creating Repository instances.
 */
export interface RepositoryFactory {

    /**
     * Create a new Repository instance.    
     */
    create(): RequiredType<Repository>;
}

/**
 * For creating a Contract for RepositoryFactory with duck-typing checks.
 */
export const LAWYER: Lawyer<RepositoryFactory> = new class implements Lawyer<RepositoryFactory> {

    /** 
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends RepositoryFactory>(instance: unknown): instance is OptionalType<X> {
        return hasFunctions(instance, "create");
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends RepositoryFactory>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "RepositoryFactory";

        return createContract<X>(copy);
    }
};

/**
 * The factory Contract for creating new Repository instances.
 */
export const CONTRACT: Contract<RequiredType<RepositoryFactory>> = LAWYER.createContract();