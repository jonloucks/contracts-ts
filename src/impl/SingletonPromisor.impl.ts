/**
 * Factory method to create an Singleton promisor implementation
 * 
 * @param referent the source promisor
 * @param <T> the type of deliverable
 * @returns the new Singleton Promisor implementation
 */
export function create<T>(referent: Promisor<T>): RequiredType<Promisor<T>> {
    return SingletonPromisorImpl.internalCreate<T>(referent);
}

/**
 * Implementation for {@link io.github.jonloucks.contracts.api.Promisors#createSingletonPromisor(Promisor)}
 * @see io.github.jonloucks.contracts.api.Promisors#createSingletonPromisor(Promisor)
 * @param <T> The type of deliverable
 */
class SingletonPromisorImpl<T> implements Promisor<T> {

    demand(): OptionalType<T> {
        if (this.firstTime.compareAndSet(true, false)) {
            this.singletonRef.set(this.referent.demand());
        }
        return this.singletonRef.get();
    }

    incrementUsage(): number {
        return this.referent.incrementUsage();
    }

    decrementUsage(): number {
        return this.referent.decrementUsage();
    }

    static internalCreate<T>(referent: Promisor<T>): RequiredType<Promisor<T>> {
        return new SingletonPromisorImpl<T>(referent);
    }   

    private constructor(referent: Promisor<T>) {
        this.referent = promisorCheck(referent);
    }

    private readonly referent: Promisor<T>;
    private readonly singletonRef: AtomicReference<OptionalType<T>> = createAtomicReference<OptionalType<T>>();
    private readonly firstTime: AtomicBoolean = createAtomicBoolean(true);
}

import { AtomicBoolean } from "../api/AtomicBoolean";
import { promisorCheck } from "../api/Checks";
import { Promisor } from "../api/Promisor";
import { OptionalType, RequiredType } from "../api/Types";

import { AtomicReference } from "../api/AtomicReference";
import { create as createAtomicBoolean } from "./AtomicBoolean.impl";
import { create as createAtomicReference } from "./AtomicReference.impl";

