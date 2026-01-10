import { OptionalType, RequiredType } from "./Types";

/**
 * Binding strategy. Enumish type.
 * <p>
 * Used to dictate how or if binding should happen when the Contract is already bound.
 * </p>
 * @see Contracts#bind(Contract, Promisor, BindStrategy)
 * @see Repository#store(Contract, Promisor, BindStrategy)
 * @see Repository#keep(Contract, Promisor, BindStrategy)
 */
export type BindStrategy =
    /**
     * Bind the new promisor to the given contract always or else throws an error.
    */
    "ALWAYS" |
    /**
     * Bind the new promisor to the given contract if not already bound.
    */
    "IF_NOT_BOUND" |
    /**
     * Bind the new promisor to the given contract only if replacement is allowed
    */
    "IF_ALLOWED";

/**
 * The default binding strategy
 */
export const DEFAULT_BIND_STRATEGY: BindStrategy = "IF_ALLOWED"

/**
 * Type alias for optional BindStrategy
 */
export type BindStrategyType = OptionalType<BindStrategy>;

/**
 * Resolve the given BindStrategy or return the default
 *
 * @param bindStrategy the bind strategy to resolve
 * @return the resolved bind strategy
 */ 
export function resolveBindStrategy(bindStrategy: OptionalType<BindStrategy>): RequiredType<BindStrategy> {
    return bindStrategy ?? DEFAULT_BIND_STRATEGY;
}

/**
 * Check if given value is a BindStrategy or null/undefined
 * @param instance the value to check
 * @returns true if value is a BindStrategy or null/undefined
 */
export function isBindStrategy(instance: unknown): instance is OptionalType<BindStrategy> {
    switch (instance) {
        case undefined:
        case null:
        case "ALWAYS":
        case "IF_NOT_BOUND":
        case "IF_ALLOWED":
            return true;
        default:
            return false;
    }
}


