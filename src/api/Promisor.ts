import { OptionalType, RequiredType, isRequiredConstructor, hasFunctions } from "./Types";
import { nullCheck } from "./Checks";
import { Contract, Config as ContractConfig } from "./Contract";
import { Lawyer } from "./Lawyer";
import { create as createContract } from "./RatifiedContract";

/**
 * Interface for providing a deliverable for a Contract
 * The main and required implementation is {@link #demand()}
 * There are optional methods with appropriate defaults.
 * @param <T> The type of the deliverable
 */
export interface Promisor<T> {

    /**
     * Return the deliverable promised for a Contract
     * @return the current deliverable
     */
    demand(): OptionalType<T>;

    /**
     * Reference counting used for advanced resource management
     * Incremented when bound or by other Promisors
     * Decremented if caller invokes {@link AutoClose#close()} on the return value of bind
     * Every successful 'open' must be followed by a 'close' at the appropriate time
     * @return the usage count.  This might be a constant
     */
    incrementUsage(): number;

    /**
     * Reference counting used for advanced resource management
     * Incremented by when bound or by other Promisors
     * Decremented if caller invokes {@link AutoClose#close()} on the return value of bind
     * Every successful 'open' must be followed by a 'close' at the appropriate time
     * @return the usage count.  This might be a constant
     */
    decrementUsage(): number;
}

/**
 * For creating a Contract for Promisor with duck-typing checks.
 */
export const LAWYER: Lawyer<Promisor<unknown>> = new class implements Lawyer<Promisor<unknown>> {

    /**
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends Promisor<unknown>>(instance: unknown): instance is OptionalType<X> {
        return hasFunctions(instance, 'demand', 'incrementUsage', 'decrementUsage');
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends Promisor<unknown>>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "Promisor";

        return createContract<X>(copy);
    }
}

export type PromisorType<T> = (new () => T) | Promisor<T> | (() => T) | (() => () => T) | T | null;

export function typeToPromisor<T>(type: PromisorType<T>): RequiredType<Promisor<T>>{
    if (type === null || type === undefined) {
        return inlinePromisor<T>(() => type);
    } else if (isRequiredConstructor<T>(type)) {
        return inlinePromisor<T>(() => new type());
    } else if (LAWYER.isDeliverable<Promisor<T>>(type)) {
        return type;
    } else if (typeof type === 'function') {
        return inlinePromisor<T>(type as () => T); // not sure if this works for (() => () => T)
    } else {
        return inlinePromisor<T>(() => type);
    }
}

export function inlinePromisor<T>(demand: () => OptionalType<T>): RequiredType<Promisor<T>> {
    const validDemand = nullCheck(demand, "Promisor demand function must be present.");
    let usageCount : number = 0;
    return {
        demand: validDemand,
        incrementUsage: () => ++usageCount,
        decrementUsage: () => --usageCount
    };
}

