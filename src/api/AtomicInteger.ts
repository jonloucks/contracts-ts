import { OptionalType, hasFunctions } from "./Types";
import { Contract, Config as ContractConfig } from "./Contract";
import { Lawyer } from "./Lawyer";
import { create as createContract } from "./RatifiedContract";

/**
 * Responsibility: An atomic integer interface for thread-safe integer operations.
 */
export interface AtomicInteger {
    get(): number;

    set(value: number): void;

    compareAndSet(expectedValue: number, newValue: number): boolean;

    incrementAndGet(): number;

    decrementAndGet(): number;

    [Symbol.toPrimitive](hint: string): string | number | boolean;
}

/**
 * For creating a Contract for AtomicInteger with duck-typing checks.
 */
export const LAWYER: Lawyer<AtomicInteger> = new class implements Lawyer<AtomicInteger> {
 
    /** 
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends AtomicInteger>(instance: unknown): instance is OptionalType<X> {
        return hasFunctions(instance, "compareAndSet", "incrementAndGet", "decrementAndGet", "get", "set");
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends AtomicInteger>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "AtomicInteger";

        return createContract<X>(copy);
    }
};

