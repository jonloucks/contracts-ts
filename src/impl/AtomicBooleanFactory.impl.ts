import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { AtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/AtomicBoolean";
import { AtomicBooleanFactory } from "@jonloucks/contracts-ts/auxiliary/AtomicBooleanFactory";

import { create as createAtomicBoolean } from "./AtomicBoolean.impl";

/**
 * Factory method to create an AtomicBooleanFactory
 * 
 * @returns the AtomicBooleanFactory implementation
 */
export function create(): RequiredType<AtomicBooleanFactory> {
  return AtomicBooleanFactoryImpl.internalCreate();
}

// ---- Implementation details below ----

/**
 * AtomicBooleanFactory implementation.
 */
class AtomicBooleanFactoryImpl implements AtomicBooleanFactory {

  /**
   * AtomicBooleanFactory.createAtomicBoolean override
   */
  createAtomicBoolean(initialValue?: boolean): RequiredType<AtomicBoolean> {
    return createAtomicBoolean(initialValue);
  }

  private constructor() {
  }

  static internalCreate(): RequiredType<AtomicBooleanFactory> {
    return new AtomicBooleanFactoryImpl();
  }
};




