import { AtomicBoolean } from "@io.github.jonloucks/contracts-ts/api/auxiliary/AtomicBoolean";
import { AtomicBooleanFactory } from "@io.github.jonloucks/contracts-ts/api/auxiliary/AtomicBooleanFactory";
import { RequiredType } from "@io.github.jonloucks/contracts-ts/api/auxiliary/Types";

import { create as createAtomicBoolean } from "@io.github.jonloucks/contracts-ts/impl/AtomicBoolean.impl";

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




