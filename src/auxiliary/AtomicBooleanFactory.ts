import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { OptionalType, RequiredType, hasFunctions } from "@jonloucks/contracts-ts/api/Types";
import { AtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/AtomicBoolean";

/**
 * Factory interface for creating AtomicBoolean instances.
 */
export interface AtomicBooleanFactory {

  /**
   * Create a new AtomicBoolean instance.    
   * @param initialValue the initial value of the AtomicBoolean
   */
  create(initialValue?: boolean): RequiredType<AtomicBoolean>;
}

/**
 * Type guard for AtomicBooleanFactory interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AtomicBooleanFactory
 */
export function guard(instance: unknown): instance is OptionalType<AtomicBooleanFactory> {
  return hasFunctions(instance, "create");
}

/**
 * The factory Contract for creating new AtomicBoolean instances.
 */
export const CONTRACT: Contract<AtomicBooleanFactory> = createContract({
  test: guard,
  name: "AtomicBooleanFactory"
});

