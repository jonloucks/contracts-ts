/**
 * Factory method to create a ContractsFactory
 * 
 * @returns the ContractsFactory implementation
 */
export function create(): RequiredType<ContractsFactory> {
    return ContractsFactoryImpl.internalCreate();
}   

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
        return createContracts(actualConfig);
    }

    static internalCreate() : RequiredType<ContractsFactory> {
        return new ContractsFactoryImpl();
    }

    private constructor() {
        //  empty
    }

    private defaultConfig : Config = {    
        getPartners: function (): Contracts[] {
            return [];
        },
        useShutdownHooks: function (): boolean {
            return true;
        }
    };
}

import { RequiredType } from "../api/Types";
import { ContractsFactory } from "../api/ContractsFactory";
import { Contracts, Config } from "../api/Contracts";
import { create as createContracts } from "./ContractsImpl"; 