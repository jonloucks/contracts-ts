import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { AtomicReference } from "@jonloucks/contracts-ts/auxiliary/AtomicReference";
import { AtomicReferenceFactory } from "@jonloucks/contracts-ts/auxiliary/AtomicReferenceFactory";

import { create as createAtomicReference } from "@jonloucks/contracts-ts/impl/AtomicReference.impl";

/**
 * Factory method to create an AtomicReferenceFactory
 * 
 * @returns the new AtomicReferenceFactory implementation
 */
export function create(): RequiredType<AtomicReferenceFactory> {
  return AtomicReferenceFactoryImpl.internalCreate();
}

// ---- Implementation details below ----

/**
 * The AtomicReferenceFactory implementation
 */
class AtomicReferenceFactoryImpl implements AtomicReferenceFactory {

  /**
   * AtomicReferenceFactory.create override
   */
  create<T>(initialValue?: OptionalType<T>): RequiredType<AtomicReference<T>> {
    return createAtomicReference(initialValue);
  }

  static internalCreate(): RequiredType<AtomicReferenceFactory> {
    return new AtomicReferenceFactoryImpl();
  }

  private constructor() {
  }
};



