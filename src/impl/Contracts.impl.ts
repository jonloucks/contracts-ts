import { AUTO_CLOSE_NONE, AutoClose, inlineAutoClose } from "../api/AutoClose";
import { BindStrategy, BindStrategyType, resolveBindStrategy } from "../api/BindStrategy";
import { configCheck, contractCheck, presentCheck } from "../api/Checks";
import { Contract } from "../api/Contract";
import { ContractException } from "../api/ContractException";
import { Config, Contracts } from "../api/Contracts";
import { Promisor, PromisorType, typeToPromisor } from "../api/Promisor";
import { isRatifiedContract } from "../api/RatifiedContract";
import { OptionalType, RequiredType, isPresent } from "../api/Types";

import { AutoCloseMany, create as createAutoCloseMany } from "./AutoCloseMany.impl";
import { Events, create as createEvents } from "./Events.impl";
import { IdempotentImpl } from "./Idempotent.impl";
import { Internal } from "./Internal.impl";

/**
 * Factory method to create Contracts instance.
 * 
 * @param config the configuration for the Contracts instance
 * @returns the Contracts implementation
 */
export function create(config: Config): RequiredType<Contracts> {
    return ContractsImpl.internalCreate(config);
}

// ---- Implementation details below ----

/**
 * Contracts implementation.
 */
class ContractsImpl implements Contracts {

    /**
     * AutoOpen.open override.
     */
    open(): AutoClose {
        if (this.openState.transitionToOpen()) {
            return this.firstOpen();
        }
        return AUTO_CLOSE_NONE;
    }

    /**
     * Contracts.claim override.
     */
    claim<T>(contract: Contract<T>): OptionalType<T> {
        const validContract: Contract<T> = contractCheck(contract);
        this.policy(validContract);
        const promisor: OptionalType<Promisor<T>>  = this.getFromPromisorMap(validContract);

        if (isPresent(promisor)) {
            return validContract.cast(promisor.demand());
        } else {
            return this.claimFromPartners(validContract);
        }
    }

    /**
     * Contracts.enforce override.
     */
    enforce<T>(contract: Contract<T>): RequiredType<T> {
        const deliverable: OptionalType<T> = this.claim(contract);
        if (isPresent(deliverable)) {
            return deliverable;
        }
        throw new ContractException("Contract " + contract + " enforcement failed: No value present.");
    }

    /**
     * Contracts.isBound override.
     */
    isBound<T>(contract: Contract<T>): boolean {
        const validContract: Contract<T> = contractCheck(contract);
        this.policy(validContract);
        const promisor: OptionalType<Promisor<T>> = this.getFromPromisorMap(validContract);
        return isPresent(promisor) || this.isAnyPartnerBound(contract);
    }

    /**
     * Contracts.bind override.
     */
    bind<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategyType): AutoClose {
        const validContract: Contract<T> = contractCheck(contract);
        this.policy(validContract);
        const validPromisor: Promisor<T> = typeToPromisor<T>(promisor);
        const validBindStrategy: BindStrategy = resolveBindStrategy(bindStrategy);

        return this.maybeBind(validContract, validPromisor, validBindStrategy);
    }

    /**
     * Object.toString override.
     */
    toString(): string {
        return `Contracts[size: ${this.#promisorMap.size}]`;
    }

    static internalCreate(config: Config): RequiredType<Contracts> {
        return new ContractsImpl(config);
    }

    private firstOpen(): AutoClose {
        this.closeMany.add(this.events.open());
        return inlineAutoClose(() => this.close());
    }

    private close(): void {
        if (this.openState.transitionToClosed()) {
            try {
                this.attemptToCloseBindings();
            } finally {
                this.closeMany.close();
            }
        }
    }

    private attemptToCloseBindings(): void {
        for (let attempts: number = 1; attempts <= 6; attempts++) {
            if (this.breakAllBindings() === 0) {
                return;
            }
        }
        this.throwCloseDidNotCompleteException();
    }

    private maybeBind<T>(contract: Contract<T>, newPromisor: Promisor<T>, bindStrategy: BindStrategy): AutoClose {
        if (this.checkBind(contract, newPromisor, bindStrategy)) {
            return this.doBind(contract, newPromisor);
        } else {
            return AUTO_CLOSE_NONE;
        }
    }

    private checkBind<T>(contract: Contract<T>, newPromisor: Promisor<T>, bindStrategy: BindStrategy): boolean {
        const optionalCurrent: OptionalType<Promisor<T>> = this.getFromPromisorMap(contract);

        if (isPresent(optionalCurrent)) {
            return this.checkReplacement(contract, newPromisor, bindStrategy, optionalCurrent);
        } else {
            return true;
        }
    }

    private checkReplacement<T>(contract: Contract<T>, newPromisor: Promisor<T>, bindStrategy: BindStrategy, currentPromisor: Promisor<T>): boolean {
        // Double bind of same promisor, do not rebind
        // Review unwrapping if needed in future
        if (currentPromisor === newPromisor) {
            return false;
        }

        switch (bindStrategy) {
            case "ALWAYS":
                if (contract.replaceable) {
                    return true;
                }
                this.throwContractNotReplaceableException(contract);
            case "IF_NOT_BOUND":
                return false;
            case "IF_ALLOWED":
            default:
                return contract.replaceable;
        }
    }

    private doBind<T>(contract: Contract<T>, promisor: Promisor<T>): AutoClose {
        // Since ReentrantReadWriteLock does not support lock upgrade, there are opportunities
        // for changes by other threads between the reads and writes.
        // This is mitigated by always incrementing the new value and decrementing the old value.
        promisor.incrementUsage();

        const previousPromisor: OptionalType<Promisor<T>> = this.getFromPromisorMap(contract);
        this.#promisorMap.set(contract, promisor);
        if (isPresent(previousPromisor)) {
            previousPromisor.decrementUsage();
        }
        const breakBindingOnce: IdempotentImpl = new IdempotentImpl();
        breakBindingOnce.transitionToOpen();
        return inlineAutoClose(() => {
            if (breakBindingOnce.transitionToClosed()) {
                this.breakBinding(contract, promisor);
            }
        });
    }

    private breakBinding<T>(contract: Contract<T>, promisor: Promisor<T>): void {
        // it is possible the Contract has already been removed or updated with a new Promisor
        // Checking the removed promisor is required to avoid:
        //   1. Calling decrementUsage twice on Promisors already removed
        //   2. Not calling decrementUsage enough times
        // decrementing usage too many times.
        try {
            this.removeFromPromisorMap(contract, promisor);
        } finally {
            promisor.decrementUsage();
        }
    }

    private removeFromPromisorMap<T>(contract: Contract<T>, promisor: Promisor<T>): void {
        if (this.#promisorMap.get(contract) === promisor) {
            this.#promisorMap.delete(contract);
        }
    }

    private getFromPromisorMap<T>(contract: Contract<T>): OptionalType<Promisor<T>> {
        return (this.#promisorMap.get(contract) as OptionalType<Promisor<T>>);
    }

    private breakAllBindings(): number {
        let contractCount: number = 0;
        Internal.mapForEachReversed(this.#promisorMap, (contract, promisor) => {
            this.breakBinding(contract, promisor);
            contractCount++;
        });
        return contractCount;
    }

    private hasPartners(): boolean {
        return this.partners.length > 0;
    }

    private claimFromPartners<T>(contract: Contract<T>): OptionalType<T> {
        if (this.hasPartners()) {
            for (const partner of this.partners) {
                if (partner.isBound(contract)) {
                    return partner.claim(contract);
                }
            }
        }
        this.throwContractNotPromisedException(contract);
    }

    private isAnyPartnerBound<T>(contract: Contract<T>): boolean {
        if (this.hasPartners()) {
            return this.partners.some(partner => partner.isBound(contract));
        }
        return false;
    }

    private throwCloseDidNotCompleteException(): never {
        throw new ContractException("Contracts failed to close after trying multiple times.");
    }

    private throwContractNotPromisedException<T>(contract: Contract<T>): never {
        throw new ContractException("Contract " + contract + " was not promised.");
    }

    private throwContractNotReplaceableException<T>(contract: Contract<T>): never {
        throw new ContractException("Contract " + contract + " is not replaceable.");
    }

    private constructor(config: Config) {
        const validConfig = configCheck(config);
        const validPartners = presentCheck(validConfig?.partners ?? [], "Partners must be present.");

        // hardened by default
        if (validConfig?.ratified ?? true) {
            this.policy = (contract: Contract<unknown>) => {
                if (isRatifiedContract(contract) === false) {
                    throw new ContractException("Action denied: Only a ratified contract can be used.");
                }
            };
        } else {
            this.policy = (_: Contract<unknown>) => {
                // no-op
            };
        }

        this.events = createEvents({
            names: validConfig?.shutdownEvents ?? [],
            callback: () => this.close()
        });

        if (validPartners) {
            this.partners.push(...validPartners);
        }

    }

    private readonly closeMany: AutoCloseMany = createAutoCloseMany();
    private readonly openState: IdempotentImpl = new IdempotentImpl();
    readonly #promisorMap = new Map<Contract<unknown>, Promisor<unknown>>();
    private readonly partners: Contracts[] = [];
    private readonly policy: ((contract: Contract<unknown>) => void);
    private readonly events : Events;
}






