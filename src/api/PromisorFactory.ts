import { OptionalType, RequiredType, Transform, hasFunctions } from "./Types";
import { Contract, Config as ContractConfig } from "./Contract";
import { Promisor, PromisorType } from "./Promisor";
import { Lawyer } from "./Lawyer";

/**
 * Helper methods for creating and chaining Promisors used for {@link Contractss#bind(Contract, Promisor)}
 */
export interface PromisorFactory {
 
    /**
     * Creates a Promisor that returns the given value every time it is claimed.
     *
     * @param deliverable the value to
     * @return The new Promisor
     * @param <T> the type of deliverable
     */
    createValue<T>(deliverable: OptionalType<T>) : RequiredType<Promisor<T>>;
    
    /**
     * Creates a Promisor that only calls the source Promisor once and then always
     * returns that value.
     * Note: increment and decrementUsage are relayed to the source promisor.
     *
     * @param promisor the source Promisor
     * @return The new Promisor
     * @param <T> the type of deliverable
     */
    createSingleton<T>(promisor : PromisorType<T>) : RequiredType<Promisor<T>>;
    
    /**
     * Reference counted, lazy loaded, with opt-in 'open' and 'close' invoked on deliverable.
     * Note: increment and decrementUsage are relayed to the source promisor.
     *
     * @param promisor the source promisor
     * @return the new Promisor
     * @param <T> the type of deliverable
     */
    createLifeCycle<T>(promisor : PromisorType<T>) : RequiredType<Promisor<T>>;
    
    /**
     * Extract
     * Note: increment and decrementUsage are relayed to the source promisor.
     *
     * @param promisor the source promisor
     * @param extractor the function that gets an object from the deliverable. For example Person  => Age
     * @return the new Promisor
     * @param <T> the type of deliverable
     * @param <R> the new Promisor deliverable type
     */
    createExtractor<T,R>(promisor: PromisorType<T>, extractor: Transform<T, R>) : RequiredType<Promisor<R>>;
}

/**
 * For creating a Contract for PromisorFactory with duck-typing checks.
 */
export const LAWYER: Lawyer<PromisorFactory> = new class implements Lawyer<PromisorFactory> {

    /**
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends PromisorFactory>(instance: any): instance is OptionalType<X> {
        return hasFunctions(instance, 'createExtractor', 'createLifeCycle', 'createSingleton', 'createValue');
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends PromisorFactory>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "PromisorFactory";

        return Contract.create<X>(copy);
    }
};

/**
 * The Contract for PromisorFactory implementation.
 */
export const CONTRACT: Contract<PromisorFactory> = LAWYER.createContract();

