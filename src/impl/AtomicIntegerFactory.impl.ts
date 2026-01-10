import { AtomicInteger } from "../api/AtomicInteger";
import { AtomicIntegerFactory } from "../api/AtomicIntegerFactory";
import { RequiredType } from "../api/Types";

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

