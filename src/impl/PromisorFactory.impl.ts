import { Promisor, PromisorType, typeToPromisor } from "@jonloucks/contracts-ts/api/Promisor";
import { PromisorFactory } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { OptionalType, RequiredType, Transform } from "@jonloucks/contracts-ts/api/Types";
import { create as createExtractor } from "@jonloucks/contracts-ts/impl/ExtractorPromisor.impl";
import { create as createLifeCycle } from "@jonloucks/contracts-ts/impl/LifeCyclePromisor.impl";
import { create as createSingleton } from "@jonloucks/contracts-ts/impl/SingletonPromisor.impl";
import { create as createValue } from "@jonloucks/contracts-ts/impl/ValuePromisor.impl";

/**
 * Factory to create a PromisorFactory implementation
 * 
 * @returns the PromisorFactory implementation
 */
export function create(): RequiredType<PromisorFactory> {
  return PromisorsImpl.internalCreate();
}

// ---- Implementation details below ----

/**
 * Implementation for PromisorFactory
 */
class PromisorsImpl implements PromisorFactory {

  /**
   * PromisorFactory.createValue override.
   */
  createValue<T>(deliverable: OptionalType<T>): RequiredType<Promisor<T>> {
    return createValue<T>(deliverable);
  }

  /**
   * PromisorFactory.createSingleton override.
   */
  createSingleton<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
    return createSingleton<T>(typeToPromisor(promisor));
  }

  /**
   * PromisorFactory.createLifeCycle override.
   */
  createLifeCycle<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
    return createLifeCycle(typeToPromisor(promisor));
  }

  /**
   * PromisorFactory.createExtractor override.
   */
  createExtractor<T, R>(promisor: PromisorType<T>, extractor: Transform<T, R>): RequiredType<Promisor<R>> {
    return createExtractor<T, R>(typeToPromisor(promisor), extractor);
  }

  static internalCreate(): RequiredType<PromisorFactory> {
    return new PromisorsImpl();
  }

  private constructor() {
  }
}
