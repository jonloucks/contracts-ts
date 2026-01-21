import { Config, Contract } from "@jonloucks/contracts-ts/api/Contract";
import { hasFunctions, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";

/**
 * A Contractsfactory to bootstrapping Global Contracts and provide
 * Standalone services for special needs.
 */
export interface ContractFactory {

  /**
   * Create a new Contract
   * Note: Caller is responsible for invoking 'open' before using methods
   * Note: If caller does invoke 'open' it is required to invoke 'close' when appropriate
   * 
   * @param config the Contract configuration
   * @return the new Contract
   */
  create<T>(config?: OptionalType<Config<T>>): RequiredType<Contract<T>>;
}

/**
 * Type guard for ContractFactory
 * 
 * @param value the value to check
 * @return true if value is ContractFactory, false otherwise
 */
export function guard(value: unknown): value is ContractFactory {
  return hasFunctions(value, 'create');
}