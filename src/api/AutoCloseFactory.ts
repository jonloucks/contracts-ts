import { AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType } from "@jonloucks/contracts-ts/api/AutoClose";
import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@jonloucks/contracts-ts/api/Lawyer";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { hasFunctions, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/auxiliary/Types";

/**
 * Interface for a factory that creates AutoClose instances.
 */
export interface AutoCloseFactory {

    /**
     * Create an AutoClose for a given closeable resource.
     * @param type the closeable resource
     * @returns the AutoClose instance
     */
    createAutoClose(type: RequiredType<AutoCloseType>): RequiredType<AutoClose>;

    /**
     * Create an AutoCloseMany instance for managing multiple closeable resources.
     * 
     * @returns the AutoCloseMany instance
     */
    createAutoCloseMany(): RequiredType<AutoCloseMany>;

    /**
     * Create an AutoCloseOne instance for managing a single closeable resource.
     * 
     * @returns the AutoCloseOne instance
     */
    createAutoCloseOne(): RequiredType<AutoCloseOne>;
}

export { AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType } from "@jonloucks/contracts-ts/api/AutoClose";
export { Contract } from "@jonloucks/contracts-ts/api/Contract";
export { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/auxiliary/Types";

/**
 * For creating a Contract for AutoCloseFactory with duck-typing checks.
 */
export const LAWYER: Lawyer<AutoCloseFactory> = new class implements Lawyer<AutoCloseFactory> {

    /**
     * Lawyer.isDeliverable override
     */
    isDeliverable<X extends AutoCloseFactory>(instance: unknown): instance is OptionalType<X> {
        return hasFunctions(instance, 'createAutoClose', 'createAutoCloseMany', 'createAutoCloseOne');
    }

    /** 
     * Lawyer.createContract override
     */
    createContract<X extends AutoCloseFactory>(config?: ContractConfig<X>): Contract<X> {
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= this.isDeliverable;
        copy.typeName ??= "AutoCloseFactory";

        return createContract<X>(copy);
    }
};

/**
 * The Contract for AutoCloseFactory implementation.
 */
export const CONTRACT: Contract<AutoCloseFactory> = LAWYER.createContract();

