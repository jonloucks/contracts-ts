import { AtomicBoolean } from "../api/AtomicBoolean";
import { AtomicBooleanFactory } from "../api/AtomicBooleanFactory";
import { RequiredType } from "../api/Types";

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




