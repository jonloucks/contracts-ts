import { RequiredType } from "../api/Types";
import { ContractsFactory } from "../api/ContractsFactory";
import { Contracts, Config } from "../api/Contracts";
import { create as createContractsImpl } from "./Contracts.impl"; 

/**
 * Factory method to create a ContractsFactory
 * 
 * @returns the ContractsFactory implementation
 */
export function create(): RequiredType<ContractsFactory> {
    return ContractsFactoryImpl.internalCreate();
}   

/**
 * Factory method to create Contracts instance.
 * 
 * @param config the configuration for the Contracts instance
 * @returns the Contracts implementation
 */
export function createContracts(config?: Config): RequiredType<Contracts> {
    return create().create(config);
}

// ---- Implementation details below ----

/**
 * Implementation for {@link io.github.jonloucks.contracts.api.ContractsFactory}
 * @see io.github.jonloucks.contracts.api.ContractsFactory
 */
class ContractsFactoryImpl implements ContractsFactory {
    
    /**
     * ContractsFactory.create override
     */
    create(config?: Config) : RequiredType<Contracts> {
        const actualConfig : Config = config ? config : this.defaultConfig;
        return createContractsImpl(actualConfig);
    }

    static internalCreate() : RequiredType<ContractsFactory> {
        return new ContractsFactoryImpl();
    }

    private constructor() {
        //  empty
    }

    private defaultConfig : Config = {};
}
