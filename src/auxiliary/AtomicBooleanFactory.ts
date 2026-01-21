import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@jonloucks/contracts-ts/api/Lawyer";
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

/** @deprecated use guard instead
 */
export { guard as isAtomicBooleanFactory }

/**
 * For creating a Contract for AtomicBoolean with duck-typing checks.
 * @deprecated use CONTRACT instead
 */
export const LAWYER: Lawyer<AtomicBooleanFactory> = new class implements Lawyer<AtomicBooleanFactory> {

  /** 
   * Lawyer.isDeliverable override
   */
  isDeliverable<X extends AtomicBooleanFactory>(instance: unknown): instance is OptionalType<X> {
    return guard(instance);
  }

  /** 
   * Lawyer.createContract override
   */
  createContract<X extends AtomicBooleanFactory>(config?: ContractConfig<X>): Contract<X> {
    const copy: ContractConfig<X> = { ...config ?? {} };

    copy.test ??= this.isDeliverable;
    copy.typeName ??= "AtomicBooleanFactory";

    return createContract<X>(copy);
  }
};

/**
 * The factory Contract for creating new AtomicBoolean instances.
 */
export const CONTRACT: Contract<AtomicBooleanFactory> = createContract({
  test: guard,
  name: "AtomicBooleanFactory"
});

