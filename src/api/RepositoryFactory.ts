import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";
import { RequiredType, hasFunctions } from "@jonloucks/contracts-ts/api/Types";

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
 * Type guard for RepositoryFactory
 * 
 * @param value the value to check
 * @return true if value is RepositoryFactory, false otherwise
 */
export function guard(value: unknown): value is RepositoryFactory {
  return hasFunctions(value, "create");
}

/**
 * The factory Contract for creating new Repository instances.
 */
export const CONTRACT: Contract<RequiredType<RepositoryFactory>> = createContract({
  test: guard,
  name: "RepositoryFactory"
});