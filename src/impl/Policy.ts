import { Contract } from "@jonloucks/contracts-ts/api/Contract";

/**
 * Policy interface for checking contracts.
 */
export interface Policy {

  /**
   * Check the given contract and verify that the policy accepts it.
   * If the contract is not accepted by the policy, this method throws a {@code ContractException}.
   * @param contract the contract to check
   * @throws ContractException if the contract is not accepted by the policy
   */
  checkContract<T>(contract: Contract<T>): void;
}