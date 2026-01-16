import { AtomicInteger } from "@io.github.jonloucks/contracts-ts/api/auxiliary/AtomicInteger";
import { AtomicIntegerFactory } from "@io.github.jonloucks/contracts-ts/api/auxiliary/AtomicIntegerFactory";
import { RequiredType } from "@io.github.jonloucks/contracts-ts/api/auxiliary/Types";

import { create as createAtomicInteger } from "@io.github.jonloucks/contracts-ts/impl/AtomicInteger.impl";

/**
 * Factory method to create an AtomicIntegerFactory
 * 
 * @returns the AtomicIntegerFactory implementation
 */
export function create(): RequiredType<AtomicIntegerFactory> {
  return AtomicIntegerFactoryImpl.internalCreate();
}

// ---- Implementation details below ----

/**
 * The AtomicIntegerFactory implementation
 */
class AtomicIntegerFactoryImpl implements AtomicIntegerFactory {

  /**
   * AtomicIntegerFactory.create override
   */
  create(initialValue?: number): RequiredType<AtomicInteger> {
    return createAtomicInteger(initialValue);
  }

  static internalCreate(): RequiredType<AtomicIntegerFactory> {
    return new AtomicIntegerFactoryImpl();
  }

  private constructor() {
  }
};

