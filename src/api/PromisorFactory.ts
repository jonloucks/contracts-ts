import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { Promisor, PromisorType } from "@jonloucks/contracts-ts/api/Promisor";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { OptionalType, RequiredType, Transform, guardFunctions } from "@jonloucks/contracts-ts/api/Types";

/**
 * Helper methods for creating and chaining Promisors used for {@link Contractss#bind(Contract, Promisor)}
 */
export interface PromisorFactory {

  /**
   * Creates a Promisor that returns the given value every time it is claimed.
   *
   * @param deliverable the value to
   * @return The new Promisor
   * @param <T> the type of deliverable
   */
  createValue<T>(deliverable: OptionalType<T>): RequiredType<Promisor<T>>;

  /**
   * Creates a Promisor that only calls the source Promisor once and then always
   * returns that value.
   * Note: increment and decrementUsage are relayed to the source promisor.
   *
   * @param promisor the source Promisor
   * @return The new Promisor
   * @param <T> the type of deliverable
   */
  createSingleton<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>>;

  /**
   * Reference counted, lazy loaded, with opt-in 'open' and 'close' invoked on deliverable.
   * Note: increment and decrementUsage are relayed to the source promisor.
   *
   * @param promisor the source promisor
   * @return the new Promisor
   * @param <T> the type of deliverable
   */
  createLifeCycle<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>>;

  /**
   * Extract
   * Note: increment and decrementUsage are relayed to the source promisor.
   *
   * @param promisor the source promisor
   * @param extractor the function that gets an object from the deliverable. For example Person  => Age
   * @return the new Promisor
   * @param <T> the type of deliverable
   * @param <R> the new Promisor deliverable type
   */
  createExtractor<T, R>(promisor: PromisorType<T>, extractor: Transform<T, R>): RequiredType<Promisor<R>>;
}

/**
 * Type guard for PromisorFactory
 * 
 * @param value the value to check
 * @return true if value is PromisorFactory, false otherwise
 */
export function guard(instance: unknown): instance is RequiredType<PromisorFactory> {
  return guardFunctions(instance, 'createExtractor', 'createLifeCycle', 'createSingleton', 'createValue');
}

/**
 * The Contract for PromisorFactory implementation.
 */
export const CONTRACT: Contract<PromisorFactory> = createContract({
  test: guard,
  name: "PromisorFactory",
  typeName: "PromisorFactory"
});

