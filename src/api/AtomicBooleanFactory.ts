import { AtomicBoolean } from "./AtomicBoolean";
import { RequiredType, OptionalType, hasFunctions } from "./Types";
import { Contract, Config as ContractConfig } from "./Contract";
import { Lawyer } from "./Lawyer";

/**
 * Factory interface for creating AtomicBoolean instances.
 */
export interface AtomicBooleanFactory {

    /**
     * Create a new AtomicBoolean instance.    
     * @param initialValue the initial value of the AtomicBoolean
     */
    create(initialValue?: boolean): RequiredType<AtomicBoolean>;
}

/**
 * For creating a Contract for AtomicBoolean with duck-typing checks.
 */
export const LAWYER: Lawyer<AtomicBooleanFactory> = new class implements Lawyer<AtomicBooleanFactory> {

    /** 
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends AtomicBooleanFactory>(instance: unknown): instance is OptionalType<X> {
        return hasFunctions(instance, "create");
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends AtomicBooleanFactory>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "AtomicBooleanFactory";

        return Contract.create<X>(copy);
    }
};

/**
 * The factory Contract for creating new AtomicBoolean instances.
 */
export const CONTRACT: Contract<AtomicBooleanFactory> = LAWYER.createContract();

