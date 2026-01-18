import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { OptionalType } from "@jonloucks/contracts-ts/api/Types";

/**
 * Responsibility: A Lawyer creates Contracts for a specific type T, including duck-typing checks.
 */
export interface Lawyer<T> {

  /**
   * Create a Contract for this Lawyer's deliverable type.
   * @param config 
   */
  createContract<X extends T>(config?: ContractConfig<X>): Contract<X>;

  /**
   * Duck-typing check 
   * 
   * @param instance 
   */
  isDeliverable<X extends T>(instance: unknown): instance is OptionalType<X>;
}
