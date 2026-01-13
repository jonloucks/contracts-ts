import { AutoClose } from "contracts-ts/api/AutoClose";
import { AutoOpen } from "contracts-ts/api/AutoOpen";
import { BindStrategyType as BindType } from "contracts-ts/api/BindStrategy";
import { Contract } from "contracts-ts/api/Contract";
import { PromisorType } from "contracts-ts/api/Promisor";
import { OptionalType, RequiredType } from "contracts-ts/api/Types";

/**
 * The Contracts configuration
 */
export interface Config {
    /**
     * @return if true, only ratified contracts can be used
     */
    ratified?: boolean;

    /**
     * @return optional partners. Aggregated Contracts
     */
    partners?: Contracts[]

    /**
     * an optional list of events that when fired will shutdown Contracts
     * the default is no events.
     * It can be a custom event or system events like 'beforeExit', 'SIGINT', 'SIGTERM'
     * @return list of shutdown event names
     */
    shutdownEvents?: string[];
}

/**
 * The actual implementation used for Contracts itself.
 * It is used to bootstrap Contracts without it knowing the implementation if Contracts.
 * It does know how to load the default from contracts-impl.
 * However, the design is open to have it replaced with an alternative implementation.
 */
export interface Contracts extends AutoOpen {

    /**
     * Claim the deliverable from a bound contract.
     *
     * @param contract the contract to claim
     * @param <T>      type of value returned
     * @return the value returned by the bound Promisor. A Promisor can return null
     * @throws ContractException if Promisor binding does not exist for the contract
     * @throws SecurityException if permission is denied
     * @throws IllegalArgumentException may throw when an argument is null
     */
    claim<T>(contract: Contract<T>): OptionalType<T>;

    /**
     * Enforce the deliverable from a bound contract.
     *
     * @param contract the contract to claim
     * @param <T>      type of value returned
     * @return the value returned by the bound Promisor, but never null
     * @throws ContractException if Promisor binding does not exist for the contract, or the deliverable is null
     * @throws SecurityException if permission is denied
     * @throws IllegalArgumentException may throw when an argument is null
     */
    enforce<T>(contract: Contract<T>): RequiredType<T>;

    /**
     * Checks if the contract is bound to a Promisor
     *
     * @param contract the contract to check
     * @param <T>      The type of the value returned by the promisor
     * @return true iif bound
     * @throws IllegalArgumentException may throw when an argument is null
     */
    isBound<T>(contract: Contract<T>): boolean;

    /**
     * Establish a binding between a Contract and a Promisor
     *
     * @param contract the contract to bind the Promisor
     * @param promisor the Promisor for the given contract
     * @param bindStrategy the binding strategy
     * @param <T>      The type of the value returned by the promisor
     * @return Use to release (unbind) this contract
     * @throws ContractException when contract is already bound, can't be replaced or not accepting bindings
     * @throws SecurityException when permission to bind is denied
     * @throws IllegalArgumentException may throw when an argument is null
     */
    bind<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindType): AutoClose;
}