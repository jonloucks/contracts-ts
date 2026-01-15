import { AtomicBoolean } from "contracts-ts/api/auxiliary/AtomicBoolean";
import { create as createAtomicBoolean } from "contracts-ts/impl/AtomicBoolean.impl";
import { Idempotent } from "contracts-ts/impl/Idempotent";

export { Idempotent } from "contracts-ts/impl/Idempotent";

/**
 * Factory to create an Idempotent implementation
 * 
 * @returns the new Idempotent implementation
 */
export function create(): Idempotent {
  return IdempotentImpl.internalCreate();
}

// ---- Implementation details below ----

const IS_CLOSED: boolean = false;
const IS_OPEN: boolean = true;

/**
 * The Idempotent implementation
 */
class IdempotentImpl implements Idempotent {

  transitionToOpen(): boolean {
    return this.state.compareAndSet(IS_CLOSED, IS_OPEN);
  }

  transitionToClosed(): boolean {
    return this.state.compareAndSet(IS_OPEN, IS_CLOSED);
  }

  isOpen(): boolean {
    return this.state.get() === IS_OPEN;
  }

  static internalCreate(): Idempotent {
    return new IdempotentImpl();
  }

  private constructor() {
    this.state.set(IS_CLOSED);
  }

  private readonly state: AtomicBoolean = createAtomicBoolean(IS_CLOSED);
}

