import { OptionalType, RequiredType } from "../api/Types";
import { Promisor } from "../api/Promisor";

/**
 * Factory method to create an constant value promisor implementation
 * 
 * @param referent the source promisor
 * @param <T> the type of deliverable
 * @returns the new constant value Promisor implementation
 */
export function create<T>(value: OptionalType<T>): RequiredType<Promisor<T>> {
    return ValuePromisorImpl.internalCreate(value);
}

// ---- Implementation details below ----

class ValuePromisorImpl<T> implements Promisor<T> {

    demand(): OptionalType<T> {
        return this.value
    }

    incrementUsage(): number {
        return 1;
    }

    decrementUsage(): number {
        return 1;
    }

    static internalCreate<T>(value: OptionalType<T>): RequiredType<Promisor<T>> {
        return new ValuePromisorImpl<T>(value);
    }

    private constructor(value: OptionalType<T>) {
        this.value = value;
        Object.freeze(this.value);
    }

    private readonly value: OptionalType<T>;
}

