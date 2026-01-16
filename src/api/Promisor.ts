import { presentCheck } from "@io.github.jonloucks/contracts-ts/api/auxiliary/Checks";
import { OptionalType, RequiredType, hasFunctions, isConstructorPresent, isNotPresent } from "@io.github.jonloucks/contracts-ts/api/auxiliary/Types";
import { Contract, Config as ContractConfig } from "@io.github.jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@io.github.jonloucks/contracts-ts/api/Lawyer";
import { create as createContract } from "@io.github.jonloucks/contracts-ts/api/RatifiedContract";

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
 * Check if an instance is a Promisor
 * @param instance the instance to check
 * @returns true if the instance is a Promisor, false otherwise
 */
export function isPromisor<T>(instance: unknown): instance is Promisor<T> {
  return hasFunctions(instance, 'demand', 'incrementUsage', 'decrementUsage');
}

/**
 * For creating a Contract for Promisor with duck-typing checks.
 */
export const LAWYER: Lawyer<Promisor<unknown>> = new class implements Lawyer<Promisor<unknown>> {

  /**
   * Lawyer.isDeliverable override
   */
  isDeliverable<X extends Promisor<unknown>>(instance: unknown): instance is OptionalType<X> {
    return isPromisor<X>(instance);
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
export type PromisorType<T> = (new () => T) | Promisor<T> | (() => OptionalType<T>) | (() => () => T) | T | null | undefined;

/**
 * Convert a PromisorType to a Promisor
 * 
 * @param type the type to convert
 * @returns the Promisor
 */
export function typeToPromisor<T>(type: PromisorType<T>): RequiredType<Promisor<T>> {
  if (isNotPresent(type)) {
    return wrapPromisor<T>(type, () => type); // supplier of null or undefined
  } else if (isConstructorPresent<T>(type)) {
    return wrapPromisor<T>(type, () => new type()); // supplier of new instance
  } else if (isPromisor(type)) {
    return type; // already a Promisor
  } else if (typeof type === 'function') {
    return wrapPromisor<T>(type, type as () => T); 
  } else {
    return wrapPromisor<T>(type, () => type); // instance of T, runtime type-guard happens in demand
  }
}

/**
 * Wrapper interface for Promisor to provide unwrapping capability
 */
interface PromisorWrapper<T> extends Promisor<T> {

    /**
     * Unwrap to get the original Promisor.
     */
    unwrapPromisorType(): PromisorType<T>;
}

/**
 * Create a simple inline Promisor from a demand function
 * 
 * @param type the PromisorType
 * @param demand the demand function
 * @returns the Promisor
 */
function wrapPromisor<T>(type: PromisorType<T>, demand: () => OptionalType<T>): RequiredType<PromisorWrapper<T>> {
  const validDemand = presentCheck(demand, "Promisor demand function must be present.");
  let usageCount: number = 0; 
  return {
    demand: validDemand,
    incrementUsage: () => ++usageCount, 
    decrementUsage: () => --usageCount, 
    unwrapPromisorType: () => type
  };
}

/**
 * Unwrap a Promisor to get the original type.
 * 
 * @param promisor the Promisor to unwrap
 * @returns the original PromisorType
 */
export function unwrapPromisorType<T>(promisor: OptionalType<Promisor<T>>): OptionalType<PromisorType<T>> {
    if (isNotPresent(promisor)) {
        return promisor;
    }
    if ('unwrapPromisorType' in promisor && typeof promisor.unwrapPromisorType === 'function') {
        return promisor.unwrapPromisorType();
    }
    return promisor
}

