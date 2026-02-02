import { AtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/AtomicBoolean";
import { create as createAtomicBoolean } from "./AtomicBoolean.impl";
import { DeprecatedIdempotent } from "./DeprecatedIdempotent";

export { DeprecatedIdempotent as Idempotent } from "./DeprecatedIdempotent";

/**
 * Factory to create an Idempotent implementation
 * 
 * @returns the new Idempotent implementation
 */
export function create(): DeprecatedIdempotent {
  return DeprecatedIdempotentImpl.internalCreate();
}

// ---- Implementation details below ----

const IS_CLOSED: boolean = false;
const IS_OPEN: boolean = true;

/**
 * The Idempotent implementation
 */
class DeprecatedIdempotentImpl implements DeprecatedIdempotent {

  transitionToOpen(): boolean {
    return this.state.compareAndSet(IS_CLOSED, IS_OPEN);
  }

  transitionToClosed(): boolean {
    return this.state.compareAndSet(IS_OPEN, IS_CLOSED);
  }

  isOpen(): boolean {
    return this.state.get() === IS_OPEN;
  }

  static internalCreate(): DeprecatedIdempotent {
    return new DeprecatedIdempotentImpl();
  }

  private constructor() {
    this.state.set(IS_CLOSED);
  }

  private readonly state: AtomicBoolean = createAtomicBoolean(IS_CLOSED);
}

