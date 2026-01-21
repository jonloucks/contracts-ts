import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@jonloucks/contracts-ts/api/Lawyer";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";
import { OptionalType, RequiredType, hasFunctions } from "@jonloucks/contracts-ts/api/Types";

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
 * For creating a Contract for RepositoryFactory with duck-typing checks.
 * @deprecated use createContract with guard instead
 */
export const LAWYER: Lawyer<RepositoryFactory> = new class implements Lawyer<RepositoryFactory> {

  /** 
   * Lawyer.isDeliverable override
   */
  isDeliverable<X extends RepositoryFactory>(instance: unknown): instance is OptionalType<X> {
    return guard(instance);
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
export const CONTRACT: Contract<RequiredType<RepositoryFactory>> = createContract({
  test: guard,
  name: "RepositoryFactory"
});