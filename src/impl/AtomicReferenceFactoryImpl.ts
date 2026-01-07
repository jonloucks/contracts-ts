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

import { RequiredType, OptionalType } from "../api/Types";
import { AtomicReference } from "../api/AtomicReference";
import { AtomicReferenceFactory } from "../api/AtomicReferenceFactory";

import { create as createAtomicReference} from "./AtomicReferenceImpl";

