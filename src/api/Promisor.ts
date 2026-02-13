import { OptionalType, RequiredType, guardFunctions, isConstructor, isNotPresent } from "@jonloucks/contracts-ts/api/Types";
import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

/**
 * Interface for providing a deliverable for a Contract
 * The main and required implementation is demand().
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
   * Every successful 'open' must be followed by a 'close' at the appropriate time
   * @return the usage count.  This might be a constant
   */
  incrementUsage(): number;

  /**
   * Reference counting used for advanced resource management
   * Decremented when no longer used
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
export function guard<T>(instance: unknown): instance is RequiredType<Promisor<T>> {
  return guardFunctions(instance, 'demand', 'incrementUsage', 'decrementUsage');
}

/**
 * A Function that can be converted to a Promisor
 */
export type Method<T> = (() => OptionalType<T>);

/**
 * A type that can be converted to a Promisor
 */
export type Type<T> = (new () => T) | Promisor<T> | Method<T> | T | null | undefined;

/**
 * Convert a Type to a Promisor
 * 
 * @param type the type to convert
 * @returns the Promisor
 */
export function fromType<T>(type: Type<T>): RequiredType<Promisor<T>> {
  if (isNotPresent(type)) {
    return wrap<T>(type, () => type); // supplier of null or undefined
  } else if (isConstructor<T>(type)) {
    return wrap<T>(type, () => new type()); // supplier of new instance
  } else if (guard(type)) {
    return type; // already a Promisor
  } else if (typeof type === 'function') {
    return wrap<T>(type, type as Method<T>); // supplier function
  } else {
    return wrap<T>(type, () => type); // instance of T, runtime type-guard happens in demand
  }
}

/**
 * Wrapper interface for Promisor to provide unwrapping capability
 */
interface PromisorWrapper<T> extends Promisor<T> {

  /**
   * Unwrap to get the original Promisor.
   */
  unwrapPromisorType(): Type<T>;
}

/**
 * Create a simple inline Promisor from a demand function
 * 
 * @param type the promisor type
 * @param demand the demand function
 * @returns the Promisor
 */
function wrap<T>(type: Type<T>, demand: () => OptionalType<T>): RequiredType<PromisorWrapper<T>> {
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
 * @returns the original Promisor Type
 */
export function unwrap<T>(promisor: OptionalType<Promisor<T>>): OptionalType<Type<T>> {
  if (isNotPresent(promisor)) {
    return promisor;
  }
  if ('unwrapPromisorType' in promisor && typeof promisor.unwrapPromisorType === 'function') {
    return promisor.unwrapPromisorType();
  }
  return promisor
}

