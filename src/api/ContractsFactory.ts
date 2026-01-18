import { Config, Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";

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

