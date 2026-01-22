import { AutoCloseOne } from "@jonloucks/contracts-ts/api/AutoClose";
import { AutoOpen, guard as isAutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
import { Promisor } from "@jonloucks/contracts-ts/api/Promisor";
import { OptionalType, RequiredType, isPresent } from "@jonloucks/contracts-ts/api/Types";
import { AtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/AtomicBoolean";
import { AtomicInteger } from "@jonloucks/contracts-ts/auxiliary/AtomicInteger";
import { AtomicReference } from "@jonloucks/contracts-ts/auxiliary/AtomicReference";
import { promisorCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { IllegalStateException } from "@jonloucks/contracts-ts/auxiliary/IllegalStateException";

import { create as createAtomicBoolean } from "./AtomicBoolean.impl";
import { create as createAtomicInteger } from "./AtomicInteger.impl";
import { create as createAtomicReference } from "./AtomicReference.impl";
import { create as createAutoCloseOne } from "./AutoCloseOne.impl";

/**
 * Factory to create an Life Cycle promisor implementation
 * 
 * @param referent the source promisor
 * @param <T> the type of deliverable
 * @returns the new Life Cycle Promisor implementation
 */
export function create<T>(referent: Promisor<T>): RequiredType<Promisor<T>> {
  return LifeCyclePromisorImpl.internalCreate<T>(referent);
}

// ---- Implementation details below ----

/**
 * Implementation of a Life Cycle Promisor
 * @param <T> the type of deliverable
 */
class LifeCyclePromisorImpl<T> implements Promisor<T> {

  public demand(): OptionalType<T> {
    const currentDeliverable: AtomicReference<T> = createAtomicReference<T>();
    if (this.getCurrentDeliverable(currentDeliverable)) {
      return currentDeliverable.get();
    }
    return this.createDeliverableIfNeeded();
  }

  public incrementUsage(): number {
    let currentUsage = this.usageCounter.incrementAndGet();
    this.referent.incrementUsage();
    return currentUsage;
  }

  public decrementUsage(): number {
    let currentUsage = this.usageCounter.decrementAndGet();
    try {
      if (currentUsage == 0) {
        this.closeDeliverable();
      }
    } finally {
      this.referent.decrementUsage();
    }
    return currentUsage;
  }

  static internalCreate<T>(referentPromisor: Promisor<T>): RequiredType<Promisor<T>> {
    return new LifeCyclePromisorImpl<T>(referentPromisor);
  }

  private constructor(referentPromisor: Promisor<T>) {
    this.referent = promisorCheck(referentPromisor);
  }

  private getCurrentDeliverable(placeholder: AtomicReference<T>): boolean {
    if (this.usageCounter.get() == 0) {
      throw new IllegalStateException("Usage count is zero.");
    }
    this.maybeRethrowOpenException();
    if (this.isDeliverableAcquired.get()) {
      placeholder.set(this.atomicDeliverable.get());
      return true;
    }
    return false;
  }

  private maybeRethrowOpenException(): void {
    const thrown: unknown = this.openException.get();
    if (isPresent(thrown)) {
      throw thrown;
    }
  }

  private createDeliverableIfNeeded(): OptionalType<T> {
    if (this.isDeliverableAcquired.get()) {
      return this.atomicDeliverable.get();
    } else {
      return this.createDeliverable();
    }
  }

  private createDeliverable(): OptionalType<T> {
    this.openException.set(null);
    const currentDeliverable: OptionalType<T> = this.referent.demand();
    this.atomicDeliverable.set(currentDeliverable);
    this.isDeliverableAcquired.set(true);
    this.openDeliverable(currentDeliverable);
    return currentDeliverable;
  }

  private openDeliverable(deliverable: OptionalType<T>): void {
    if (isPresent(deliverable) && isAutoOpen(deliverable)) {
      const autoOpen: AutoOpen = deliverable;
      try {
        this.closer.set(autoOpen.autoOpen());
      } catch (thrown) {
        this.openException.set(thrown);
        this.isDeliverableAcquired.set(false);
        throw thrown;
      }
    }
  }

  private closeDeliverable(): void {
    if (this.isDeliverableAcquired.get()) {
      const deliverable: OptionalType<T> | null = this.atomicDeliverable.get();
      try {
        this.closer.close();
      } finally {
        this.atomicDeliverable.compareAndSet(deliverable, null);
        this.isDeliverableAcquired.set(false);
      }
    }
  }

  private readonly usageCounter: AtomicInteger = createAtomicInteger();
  private readonly referent: Promisor<T>;
  private readonly isDeliverableAcquired: AtomicBoolean = createAtomicBoolean();
  private readonly atomicDeliverable: AtomicReference<T> = createAtomicReference<T>();
  private readonly openException: AtomicReference<unknown> = createAtomicReference<unknown>();
  private readonly closer: AutoCloseOne = createAutoCloseOne();
}


