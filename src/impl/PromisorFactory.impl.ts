import { Promisor, Type as PromisorType, fromType } from "@jonloucks/contracts-ts/api/Promisor";
import { PromisorFactory } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Type as TransformType, fromType as typeToTransform } from "@jonloucks/contracts-ts/auxiliary/Transform";
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
    return createSingleton<T>(fromType(promisor));
  }

  /**
   * PromisorFactory.createLifeCycle override.
   */
  createLifeCycle<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
    return createLifeCycle(fromType(promisor));
  }

  /**
   * PromisorFactory.createExtractor override.
   */
  createExtractor<T, R>(promisor: PromisorType<T>, extractor: TransformType<T, R>): RequiredType<Promisor<R>> {
    return createExtractor<T, R>(fromType(promisor), typeToTransform(extractor));
  }

  static internalCreate(): RequiredType<PromisorFactory> {
    return new PromisorsImpl();
  }

  private constructor() {
  }
}
