import { AtomicBoolean } from "contracts-ts/api/AtomicBoolean";
import { AtomicBooleanFactory } from "contracts-ts/api/AtomicBooleanFactory";
import { RequiredType } from "contracts-ts/api/Types";

import { create as createAtomicBoolean } from "contracts-ts/impl/AtomicBoolean.impl";

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
   * AutomicBooleanFactory.create override
   */
  create(initialValue?: boolean): RequiredType<AtomicBoolean> {
    return createAtomicBoolean(initialValue);
  }

  private constructor() {
  }

  static internalCreate(): RequiredType<AtomicBooleanFactory> {
    return new AtomicBooleanFactoryImpl();
  }
};




