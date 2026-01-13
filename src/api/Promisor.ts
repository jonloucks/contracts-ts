import { presentCheck } from "contracts-ts/api/Checks";
import { Contract, Config as ContractConfig } from "contracts-ts/api/Contract";
import { Lawyer } from "contracts-ts/api/Lawyer";
import { create as createContract } from "contracts-ts/api/RatifiedContract";
import { OptionalType, RequiredType, hasFunctions, isConstructorPresent, isNotPresent } from "contracts-ts/api/Types";

/**
 * Interface for providing a deliverable for a Contract
 * The main and required implementation is {@link #demand()}
 * There are optional methods with appropriate defaults.
 * @param <T> The type of the deliverable
 */
export interface Promisor<T> {

  /**
   * Return the deliverable promised for a Contract
   * @return the current deliverable
   */
  demand(): OptionalType<T>;

  /**
   * Reference counting used for advanced resource management
   * Incremented when bound or by other Promisors
   * Decremented if caller invokes {@link AutoClose#close()} on the return value of bind
   * Every successful 'open' must be followed by a 'close' at the appropriate time
   * @return the usage count.  This might be a constant
   */
  incrementUsage(): number;

  /**
   * Reference counting used for advanced resource management
   * Incremented by when bound or by other Promisors
   * Decremented if caller invokes {@link AutoClose#close()} on the return value of bind
   * Every successful 'open' must be followed by a 'close' at the appropriate time
   * @return the usage count.  This might be a constant
   */
  decrementUsage(): number;
}

/**
 * For creating a Contract for Promisor with duck-typing checks.
 */
export const LAWYER: Lawyer<Promisor<unknown>> = new class implements Lawyer<Promisor<unknown>> {

  /**
   * Lawyer.isDeliverable override
   */
  isDeliverable<X extends Promisor<unknown>>(instance: unknown): instance is OptionalType<X> {
    return hasFunctions(instance, 'demand', 'incrementUsage', 'decrementUsage');
  }

  /** 
   * Lawyer.createContract override
   */
  createContract<X extends Promisor<unknown>>(config?: ContractConfig<X>): Contract<X> {
    const copy: ContractConfig<X> = { ...config ?? {} };

    copy.test ??= this.isDeliverable;
    copy.typeName ??= "Promisor";

    return createContract<X>(copy);
  }
}

/**
 * A type that can be converted to a Promisor
 */
export type PromisorType<T> = (new () => T) | Promisor<T> | (() => T) | (() => () => T) | T | null;

/**
 * Convert a PromisorType to a Promisor
 * @param type the type to convert
 * @returns the Promisor
 */
export function typeToPromisor<T>(type: PromisorType<T>): RequiredType<Promisor<T>> {
  if (isNotPresent(type)) {
    return inlinePromisor<T>(() => type);
  } else if (isConstructorPresent<T>(type)) {
    return inlinePromisor<T>(() => new type());
  } else if (LAWYER.isDeliverable<Promisor<T>>(type)) {
    return type as RequiredType<Promisor<T>>;
  } else if (typeof type === 'function') {
    return inlinePromisor<T>(type as () => T); // not sure if this works for (() => () => T)
  } else {
    return inlinePromisor<T>(() => type);
  }
}

/**
 * Create a simple inline Promisor from a demand function
 * @param demand the demand function
 * @returns the Promisor
 */
export function inlinePromisor<T>(demand: () => OptionalType<T>): RequiredType<Promisor<T>> {
  const validDemand = presentCheck(demand, "Promisor demand function must be present.");
  let usageCount: number = 0;
  return {
    demand: validDemand,
    incrementUsage: () => ++usageCount,
    decrementUsage: () => --usageCount
  };
}

