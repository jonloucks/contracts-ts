import { RequiredType } from "contracts-ts/api/Types";
import { Contracts, Config } from "contracts-ts/api/Contracts";

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

