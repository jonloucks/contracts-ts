import { Config, Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { hasFunctions, RequiredType } from "@jonloucks/contracts-ts/api/Types";

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
 * Type guard for ContractsFactory
 * 
 * @param value the value to check
 * @return true if value is ContractsFactory, false otherwise
 */
export function guard(value: unknown): value is ContractsFactory {
  return hasFunctions(value, 'create');
}