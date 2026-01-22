import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { AtomicInteger } from "@jonloucks/contracts-ts/auxiliary/AtomicInteger";
import { AtomicIntegerFactory } from "@jonloucks/contracts-ts/auxiliary/AtomicIntegerFactory";

import { create as createAtomicInteger } from "./AtomicInteger.impl";

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
  createAtomicInteger(initialValue?: number): RequiredType<AtomicInteger> {
    return createAtomicInteger(initialValue);
  }

  static internalCreate(): RequiredType<AtomicIntegerFactory> {
    return new AtomicIntegerFactoryImpl();
  }

  private constructor() {
  }
};

