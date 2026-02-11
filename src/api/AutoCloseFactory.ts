import { AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType } from "@jonloucks/contracts-ts/api/AutoClose";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { guardFunctions, RequiredType } from "@jonloucks/contracts-ts/api/Types";

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

export { type AutoClose, type AutoCloseMany, type AutoCloseOne, type AutoCloseType } from "@jonloucks/contracts-ts/api/AutoClose";
export { type Contract } from "@jonloucks/contracts-ts/api/Contract";
export { type OptionalType, type RequiredType } from "@jonloucks/contracts-ts/api/Types";

/**
 * Type guard for AutoCloseFactory interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AutoCloseFactory
 */
export function guard(instance: unknown): instance is RequiredType<AutoCloseFactory> {
    return guardFunctions(instance, 'createAutoClose', 'createAutoCloseMany', 'createAutoCloseOne');
}

/**
 * The Contract for AutoCloseFactory implementation.
 */
export const CONTRACT: Contract<AutoCloseFactory> = createContract({
    test: guard,
    name: "AutoCloseFactory",
    typeName: "AutoCloseFactory"
});

