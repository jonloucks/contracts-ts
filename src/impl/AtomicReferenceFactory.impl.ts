/**
 * Factory method to create an AtomicReferenceFactory
 * 
 * @returns the new AtomicReferenceFactory implementation
 */
export function create(): RequiredType<AtomicReferenceFactory> {
    return AtomicReferenceFactoryImpl.internalCreate();
}

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

import { AtomicReference } from "../api/AtomicReference";
import { AtomicReferenceFactory } from "../api/AtomicReferenceFactory";
import { OptionalType, RequiredType } from "../api/Types";

import { create as createAtomicReference } from "./AtomicReference.impl";

