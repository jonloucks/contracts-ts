import { AtomicBoolean } from "contracts-ts/api/AtomicBoolean";
import { promisorCheck } from "contracts-ts/api/Checks";
import { Promisor } from "contracts-ts/api/Promisor";
import { OptionalType, RequiredType } from "contracts-ts/api/Types";

import { AtomicReference } from "contracts-ts/api/AtomicReference";
import { create as createAtomicBoolean } from "contracts-ts/impl/AtomicBoolean.impl";
import { create as createAtomicReference } from "contracts-ts/impl/AtomicReference.impl";

/**
 * Factory method to create an Singleton promisor implementation
 * 
 * @param referent the source promisor
 * @param <T> the type of deliverable
 * @returns the new Singleton Promisor implementation
 */
export function create<T>(referent: Promisor<T>): RequiredType<Promisor<T>> {
  return SingletonPromisorImpl.internalCreate<T>(referent);
}

// ---- Implementation details below ----

/**
 * Implementation of a Singleton Promisor
 * @param <T> The type of deliverable
 */
class SingletonPromisorImpl<T> implements Promisor<T> {

  demand(): OptionalType<T> {
    if (this.firstTime.compareAndSet(true, false)) {
      this.singletonRef.set(this.referent.demand());
    }
    return this.singletonRef.get();
  }

  incrementUsage(): number {
    return this.referent.incrementUsage();
  }

  decrementUsage(): number {
    return this.referent.decrementUsage();
  }

  static internalCreate<T>(referent: Promisor<T>): RequiredType<Promisor<T>> {
    return new SingletonPromisorImpl<T>(referent);
  }

  private constructor(referent: Promisor<T>) {
    this.referent = promisorCheck(referent);
  }

  private readonly referent: Promisor<T>;
  private readonly singletonRef: AtomicReference<OptionalType<T>> = createAtomicReference<OptionalType<T>>();
  private readonly firstTime: AtomicBoolean = createAtomicBoolean(true);
}

