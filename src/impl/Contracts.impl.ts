import { AUTO_CLOSE_NONE, AutoClose, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { configCheck, contractCheck, presentCheck } from "@jonloucks/contracts-ts/api/auxiliary/Checks";
import { OptionalType, RequiredType, isPresent } from "@jonloucks/contracts-ts/api/auxiliary/Types";
import { BindStrategy, BindStrategyType, resolveBindStrategy } from "@jonloucks/contracts-ts/api/BindStrategy";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { Config, Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Promisor, PromisorType, typeToPromisor } from "@jonloucks/contracts-ts/api/Promisor";

import { AutoCloseMany, create as createAutoCloseMany } from "@jonloucks/contracts-ts/impl/AutoCloseMany.impl";
import { Events, create as createEvents } from "@jonloucks/contracts-ts/impl/Events.impl";
import { Idempotent, create as createIdempotent } from "@jonloucks/contracts-ts/impl/Idempotent.impl";
import { Internal } from "@jonloucks/contracts-ts/impl/Internal.impl";
import { Policy, create as createPolicy } from "@jonloucks/contracts-ts/impl/Policy.impl";

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
    if (this.idempotent.transitionToOpen()) {
      return this.firstOpen();
    }
    return AUTO_CLOSE_NONE;
  }

  /**
   * Contracts.claim override.
   */
  claim<T>(contract: Contract<T>): OptionalType<T> {
    const validContract: Contract<T> = contractCheck(contract);
    this.policy.checkContract(validContract);
    const promisor: OptionalType<Promisor<T>> = this.getFromPromisorMap(validContract);

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
    this.policy.checkContract(validContract);
    const promisor: OptionalType<Promisor<T>> = this.getFromPromisorMap(validContract);
    return isPresent(promisor) || this.isAnyPartnerBound(contract);
  }

  /**
   * Contracts.bind override.
   */
  bind<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategyType): AutoClose {
    const validContract: Contract<T> = contractCheck(contract);
    this.policy.checkContract(validContract);
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
    return inlineAutoClose(() => this.closeFirstOpen());
  }

  private closeFirstOpen(): void {
    if (this.idempotent.transitionToClosed()) {
      try {
        this.attemptToCloseBindings();
      } finally {
        this.closeMany.close();
      }
    }
  }

  private attemptToCloseBindings(): void {
    const MAX_RETRIES = 6;
    let iterations = 0;

    while (this.breakAllBindings() > 0) {
      iterations++;
      if (iterations >= MAX_RETRIES) {
        throw new ContractException(
          `Failed to break all bindings after ${MAX_RETRIES} attempts`
        );
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
    const breakBindingOnce: Idempotent = createIdempotent();
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

  private throwContractNotPromisedException<T>(contract: Contract<T>): never {
    throw new ContractException("Contract " + contract + " was not promised.");
  }

  private throwContractNotReplaceableException<T>(contract: Contract<T>): never {
    throw new ContractException("Contract " + contract + " is not replaceable.");
  }

  private constructor(config: Config) {
    const validConfig = configCheck(config);
    const validPartners = presentCheck(validConfig?.partners ?? [], "Partners must be present.");

    this.policy = createPolicy(validConfig);
    this.events = createEvents({
      names: validConfig?.shutdownEvents ?? [],
      callback: () => this.closeFirstOpen()
    });

    if (isPresent(validPartners)) {
      this.partners.push(...validPartners);
    }
  }

  private readonly closeMany: AutoCloseMany = createAutoCloseMany();
  private readonly idempotent: Idempotent = createIdempotent();
  readonly #promisorMap = new Map<Contract<unknown>, Promisor<unknown>>();
  private readonly partners: Contracts[] = [];
  private readonly policy: Policy;
  private readonly events: Events;
}






