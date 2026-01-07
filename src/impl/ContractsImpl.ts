/**
 * Factory method to create Contracts instance.
 * 
 * @param config the configuration for the Contracts instance
 * @returns the Contracts implementation
 */
export function create(config: Config): RequiredType<Contracts> {
    return ContractsImpl.internalCreate(config);
}

/**
 * Contracts implementation.
 */
class ContractsImpl implements Contracts {

    /**
     * AutoOpen.open override.
     */
    open(): AutoClose {
        if (this.openState.transitionToOpen()) {
            this.closeRepository.set(this.repository.open());
            return inlineAutoClose(() => this.close());
        }
        return AUTO_CLOSE_NONE;
    }

    /**
     * Contracts.claim override.
     */
    claim<T>(contract: Contract<T>): OptionalType<T> {
        const validContract: Contract<T> = contractCheck(contract);
        const promisor: Promisor<T> | null = this.getFromPromisorMap(validContract);

        if (null !== promisor) {
            return validContract.cast(promisor.demand());
        } else {
            return this.claimFromPartners(validContract);
        }
    }

    /**
     * Contracts.enforce override.
     */
    enforce<T>(contract: Contract<T>): NonNullable<T> {
        const deliverable: OptionalType<T> = this.claim(contract);
        if (deliverable === null || deliverable === undefined) {
            throw new ContractException("Contract " + contract + " returned a null deliverable.");
        }
        return deliverable;
    }

    /**
     * Contracts.isBound override.
     */
    isBound<T>(contract: Contract<T>): boolean {
        const validContract: Contract<T> = contractCheck(contract);
        const promisor: Promisor<T> | null = this.getFromPromisorMap(validContract);

        return (null !== promisor && undefined !== promisor) || this.isAnyPartnerBound(contract);
    }

    /**
     * Contracts.bind override.
     */
    bind<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategyParameter): AutoClose {
        const validContract: Contract<T> = contractCheck(contract);
        const validPromisor: Promisor<T> = typeToPromisor<T>(promisor);
        const validBindStrategy: BindStrategy = resolveBindStrategy(bindStrategy);

        return this.maybeBind(validContract, validPromisor, validBindStrategy);
    }

    /**
     * Object.toString override.
     */
    toString(): string {
        return `Contracts[size: ${this.promisorMap.size}]`;
    }

    static internalCreate(config: Config): RequiredType<Contracts> {
        return new ContractsImpl(config);
    }

    private constructor(config: Config) {
        const validConfig = configCheck(config);
        const validPartners = nullCheck(validConfig.getPartners?.() ?? [], "Partners must be present.")

        // keeping the promises open permanently
        this.repository.keep(ATOMIC_BOOLEAN_FACTORY, createAtomicBooleanFactory);
        this.repository.keep(ATOMIC_INTEGER_FACTORY, createAtomicIntegerFactory);
        this.repository.keep(ATOMIC_REFERENCE_FACTORY, createAtomicReferenceFactory);
        this.repository.keep(PROMISORS, createPromisorFactory);
        this.repository.keep(REPOSITORY_FACTORY, () => createRepositoryFactory(this));
        if (validPartners) {
            this.partners.push(...validPartners);
        }

        if (validConfig.useShutdownHooks?.() ?? true) {
            // Runtime.getRuntime().addShutdownHook(new Thread(this::close));
        }
    }

    private close(): void {
        if (this.openState.transitionToClosed()) {
            try {
                for (let attempts: number = 1, broken = this.breakAllBindings(); broken > 0; broken = this.breakAllBindings(), attempts++) {
                    if (attempts > 5) {
                        throw this.newCloseDidNotCompleteException();
                    }
                }
            } finally {
                this.closeRepository.close();
            }
        }
    }

    private maybeBind<T>(contract: Contract<T>, newPromisor: Promisor<T>, bindStrategy: BindStrategy): AutoClose {
        if (this.checkBind(contract, newPromisor, bindStrategy)) {
            return this.doBind(contract, newPromisor);
        } else {
            return AUTO_CLOSE_NONE;
        }
    }

    private checkBind<T>(contract: Contract<T>, newPromisor: Promisor<T>, bindStrategy: BindStrategy): boolean {
        const optionalCurrent: Promisor<T> | null = this.getFromPromisorMap(contract);

        if (optionalCurrent !== null) {
            return this.checkReplacement(contract, newPromisor, bindStrategy, optionalCurrent);
        } else {
            return true;
        }
    }

    private checkReplacement<T>(contract: Contract<T>, newPromisor: Promisor<T>, bindStrategy: BindStrategy, currentPromisor: Promisor<T>): boolean {
        // Double bind of same promisor, do not rebind
        if (currentPromisor === newPromisor) {
            return false;
        }

        switch (bindStrategy) {
            case "ALWAYS":
                if (contract.isReplaceable()) {
                    return true;
                }
                throw this.newContractNotReplaceableException(contract);
            case "IF_NOT_BOUND":
                return false;
            case "IF_ALLOWED":
            default:
                return contract.isReplaceable();
        }
    }

    private doBind<T>(contract: Contract<T>, promisor: Promisor<T>): AutoClose {
        // Since ReentrantReadWriteLock does not support lock upgrade, there are opportunities
        // for changes by other threads between the reads and writes.
        // This is mitigated by always incrementing the new value and decrementing the old value.
        promisor.incrementUsage();

        const previousPromisor: Promisor<T> | undefined = this.promisorMap.get(contract) as Promisor<T> | undefined
        this.promisorMap.set(contract, promisor);
        if (previousPromisor !== undefined) {
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
        if (this.promisorMap.get(contract) === promisor) {
            this.promisorMap.delete(contract);
        }
    }

    private getFromPromisorMap<T>(contract: Contract<T>): Promisor<T> | null {
        return (this.promisorMap.get(contract) as Promisor<T>) || null;
    }

    private breakAllBindings(): number {
        const reversedContracts: Contract<unknown>[] = [];
        const reversedPromisors: Promisor<unknown>[] = [];
        const contractCount: number = this.copyBindings(reversedContracts, reversedPromisors);

        while (reversedContracts.length > 0) {
            this.breakBinding(reversedContracts.pop()!, reversedPromisors.pop()!);
        }
        return contractCount;
    }

    private copyBindings(contracts: Contract<unknown>[], promisors: Promisor<unknown>[]): number {
        // During shutdown other threads should be able to acquire read and write locks
        // The following attains the write lock to attain all the current keys and values
        // in the reverse order from insertion.
        // The last to be inserted is the first to be removed.
        // const contractCount: AtomicInteger = this.enforce(ATOMIC_INTEGER_FACTORY)()
        const contractCount: AtomicInteger = createAtomicInteger();

        this.promisorMap.forEach((promisor, contract) => {
            contracts.push(contract);
            promisors.push(promisor);
            contractCount.incrementAndGet();
        });
        return contractCount.get();
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
        throw this.newContractNotPromisedException(contract);
    }

    private isAnyPartnerBound<T>(contract: Contract<T>): boolean {
        if (this.hasPartners()) {
            return this.partners.some(partner => partner.isBound(contract));
        }
        return false;
    }

    private newCloseDidNotCompleteException(): ContractException {
        return new ContractException("Contracts failed to close after trying multiple times.");
    }

    private newContractNotPromisedException<T>(contract: Contract<T>): ContractException {
        return new ContractException("Contract " + contract + " was not promised.");
    }

    private newContractNotReplaceableException<T>(contract: Contract<T>): ContractException {
        return new ContractException("Contract " + contract + " is not replaceable.");
    }

    private readonly openState: IdempotentImpl = new IdempotentImpl();
    private readonly promisorMap = new Map<Contract<unknown>, Promisor<unknown>>();
    private readonly repository: Repository = createRepository(this);
    private readonly partners: Contracts[] = [];
    private readonly closeRepository: CloserImpl = new CloserImpl();
};

import { OptionalType, RequiredType } from "../api/Types";
import { nullCheck, configCheck } from "../api/Checks";
import { AutoClose, AUTO_CLOSE_NONE, inlineAutoClose } from "../api/AutoClose";
import { BindStrategy, resolveBindStrategy, BindStrategyParameter } from "../api/BindStrategy";
import { contractCheck } from "../api/Checks";
import { Contract } from "../api/Contract";
import { Contracts, Config } from "../api/Contracts";
import { typeToPromisor, Promisor, PromisorType } from "../api/Promisor";
import { CONTRACT as REPOSITORY_FACTORY } from "../api/RepositoryFactory";
import { Repository } from "../api/Repository";
import { CONTRACT as PROMISORS } from "../api/PromisorFactory";
import { CONTRACT as ATOMIC_BOOLEAN_FACTORY } from "../api/AtomicBooleanFactory";
import { AtomicInteger } from "../api/AtomicInteger";
import { CONTRACT as ATOMIC_INTEGER_FACTORY } from '../api/AtomicIntegerFactory';
import { CONTRACT as ATOMIC_REFERENCE_FACTORY } from "../api/AtomicReferenceFactory";
import { ContractException } from "../api/ContractException";

import { IdempotentImpl } from "./IndempotentImpl";
import { CloserImpl } from "./CloserImpl";
import { create as createPromisorFactory } from "./PromisorFactoryImpl";
import { create as createAtomicReferenceFactory } from "./AtomicReferenceFactoryImpl";
import { create as createAtomicInteger } from "./AtomicIntegerImpl";
import { create as createAtomicIntegerFactory } from "./AtomicIntegerFactoryImpl";
import { create as createAtomicBooleanFactory } from "./AtomicBooleanFactoryImpl";
import { create as createRepository } from "./RepositoryImpl";
import { create as createRepositoryFactory } from "./RepositoryFactoryImpl";





