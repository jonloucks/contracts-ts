import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { RequiredType, guardFunctions } from "@jonloucks/contracts-ts/api/Types";
import { Idempotent, Config } from "@jonloucks/contracts-ts/auxiliary/Idempotent";

/**
 * Idempotent Factory
 */
export interface IdempotentFactory {

  /**
   * Create a new Idempotent using the provided configuration.
   *
   * @param config configuration for the idempotent; invalid or null/undefined values are not allowed
   * @returns an Idempotent instance created from the given configuration
   * @throws Error if the configuration is invalid or the idempotent cannot be created
   */
  createIdempotent(config: Config): RequiredType<Idempotent>;
}

/**
 * Determine if the given instance is a IdempotentFactory
 *
 * @param instance the instance to check
 * @return true if the instance is a IdempotentFactory
 */
export function guard(instance: unknown): instance is RequiredType<IdempotentFactory> {
  return guardFunctions(instance, 'createIdempotent');
}

/**
 * Contract for IdempotentFactory
 */
export const CONTRACT: Contract<IdempotentFactory> = createContract({
  name: "IdempotentFactory",
  test: guard
});