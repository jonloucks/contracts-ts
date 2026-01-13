import { AtomicReference } from "contracts-ts/api/AtomicReference";
import { AtomicReferenceFactory } from "contracts-ts/api/AtomicReferenceFactory";
import { OptionalType, RequiredType } from "contracts-ts/api/Types";

import { create as createAtomicReference } from "contracts-ts/impl/AtomicReference.impl";

/**
 * Factory method to create an AtomicReferenceFactory
 * 
 * @returns the new AtomicReferenceFactory implementation
 */
export function create(): RequiredType<AtomicReferenceFactory> {
    return AtomicReferenceFactoryImpl.internalCreate();
}

// ---- Implementation details below ----

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



