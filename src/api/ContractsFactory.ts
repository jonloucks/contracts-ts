import { OptionalType, RequiredType, hasRequiredFunctions } from './Types';
import { Contracts, Config } from './Contracts';
import { Contract, Config as ContractConfig } from './Contract';
import { Lawyer } from './Lawyer';

/**
 * A Contracts factory to bootstrapping Global Contracts and provide
 * Standalone services for special needs.
 */
export interface ContractsFactory {

    /**
     * Create a new Contracts
     * Note: Caller is responsible for invoking 'open' before using methods
     * Note: If caller does invoke 'open' it is required to invoke 'close' when appropriate
     * @param config the Contracts configuration
     * @return the new Contracts
     */
    create(config?: Config): RequiredType<Contracts>;
}

/**
 * Duck-typing check for ContractsFactory
 * 
 * @param instance the instance to check
 * @returns whether the instance is a ContractsFactory
 * @deprecated Use LAWYER.isDeliverable() instead.
 */
export function isContractsFactory(instance: any): instance is OptionalType<ContractsFactory> {
    return instance === null || instance === undefined || hasRequiredFunctions(instance, "create");
}

/**
 * For creating a Contract for Contracts with duck-typing checks.
 */
export const LAWYER: Lawyer<ContractsFactory> = new class implements Lawyer<ContractsFactory> {

    /**
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends ContractsFactory>(instance: any): instance is OptionalType<X> {
        return instance === null || instance === undefined || hasRequiredFunctions(instance, "create");
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends ContractsFactory>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "ContractsFactory";

        return Contract.create<X>(copy);
    }
};

/**
 * The factory Contract for creating new Contracts instances.
 */
export const CONTRACT: Contract<ContractsFactory> = LAWYER.createContract();

