import { AtomicInteger } from "contracts-ts/api/AtomicInteger";
import { AtomicIntegerFactory } from "contracts-ts/api/AtomicIntegerFactory";
import { RequiredType } from "contracts-ts/api/Types";

import { create as createAtomicInteger } from "contracts-ts/impl/AtomicInteger.impl";

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

