import { Promisor, PromisorType, typeToPromisor } from "@jonloucks/contracts-ts/api/Promisor";
import { PromisorFactory } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { OptionalType, RequiredType, TransformType, typeToTransform } from "@jonloucks/contracts-ts/api/Types";
import { create as createExtractor } from "./ExtractorPromisor.impl.js";
import { create as createLifeCycle } from "./LifeCyclePromisor.impl.js";
import { create as createSingleton } from "./SingletonPromisor.impl.js";
import { create as createValue } from "./ValuePromisor.impl.js";

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
  createExtractor<T, R>(promisor: PromisorType<T>, extractor: TransformType<T, R>): RequiredType<Promisor<R>> {
    return createExtractor<T, R>(typeToPromisor(promisor), typeToTransform(extractor));
  }

  static internalCreate(): RequiredType<PromisorFactory> {
    return new PromisorsImpl();
  }

  private constructor() {
  }
}
