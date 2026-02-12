import { presentCheck, promisorCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Promisor } from "@jonloucks/contracts-ts/api/Promisor";
import { isNotPresent, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Transform } from "@jonloucks/contracts-ts/auxiliary/Transform";
/**
 * Factory method to create an ExtractPromisorImpl which is extraction promisor
 * 
 * @param referent the source promisor
 * @param transform the transform function to extract the new value
 * @param <T> the input deliverable type
 * @param <R> the output deliverable type           
 * @returns the new Extract Promisor implementation
 */
export function create<T, R>(referent: Promisor<T>, transform: Transform<T, R>): RequiredType<Promisor<R>> {
  return ExtractorPromisorImpl.internalCreate<T, R>(referent, transform);
}

// ---- Implementation details below ----

/**
 * Implementation of an Extractor Promisor
 * @param <T> the input deliverable type
 * @param <R> the output deliverable type
 */
class ExtractorPromisorImpl<T, R> implements Promisor<R> {

  /**
   * Promisor.demand override.
   */
  demand(): OptionalType<R> {
    const referentValue = this.#referent.demand();
    if (isNotPresent(referentValue)) {
      return referentValue;
    } else {
      return this.#transform.transform(referentValue);
    }
  }

  /**
   * Promisor.incrementUsage override.
   */
  incrementUsage(): number {
    return this.#referent.incrementUsage();
  }

  /**
   * Promisor.decrementUsage override.
   */
  decrementUsage(): number {
    return this.#referent.decrementUsage();
  }

  static internalCreate<T, R>(referent: Promisor<T>, transform: Transform<T, R>): RequiredType<Promisor<R>> {
    return new ExtractorPromisorImpl<T, R>(referent, transform);
  }

  private constructor(referent: Promisor<T>, transform: Transform<T, R>) {
    this.#referent = promisorCheck(referent);
    this.#transform = presentCheck(transform, "Transform must be present.");
  }

  readonly #referent: Promisor<T>;
  readonly #transform: Transform<T, R>;
}