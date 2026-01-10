/**
 * Factory to create a PromisorFactory implementation
 * 
 * @returns the PromisorFactory implementation
 */
export function create(): RequiredType<PromisorFactory> {
    return PromisorsImpl.internalCreate();
}

/**
 * Implementation for {@link io.github.jonloucks.contracts.api.Promisors}
 * @see io.github.jonloucks.contracts.api.Promisors
 */
class PromisorsImpl implements PromisorFactory {

    /**
     * PromisorFactory.createValue override.
     */
    createValue<T>(deliverable: OptionalType<T>): RequiredType<Promisor<T>> {
        return createValue<T>(deliverable);
    }

    /**
     * PromisorFactory.createSingleton override.
     */
    createSingleton<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
        return createSingleton<T>(typeToPromisor(promisor));
    }

    /**
     * PromisorFactory.createLifeCycle override.
     */
    createLifeCycle<T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
        return createLifeCycle(typeToPromisor(promisor));
    }

    /**
     * PromisorFactory.createExtractor override.
     */
    createExtractor<T, R>(promisor: PromisorType<T>, extractor: Transform<T, R>): RequiredType<Promisor<R>> {
        return createExtractor<T, R>(typeToPromisor(promisor), extractor);
    }

    static internalCreate(): RequiredType<PromisorFactory> {
        return new PromisorsImpl();
    }

    private constructor() {
    }
}

import { OptionalType, RequiredType, Transform } from "../api/Types";
import { Promisor, PromisorType, typeToPromisor } from "../api/Promisor";
import { PromisorFactory } from "../api/PromisorFactory";
import { create as createExtractor } from "./ExtractorPromisor.impl";
import { create as createLifeCycle } from "./LifeCyclePromisor.impl";
import { create as createSingleton } from "./SingletonPromisor.impl";
import { create as createValue } from "./ValuePromisor.impl";