import { AutoClose, AutoCloseOne, AutoCloseType, fromType as typeToAutoClose, unwrap as unwrapAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { isPresent, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { AtomicReference } from "@jonloucks/contracts-ts/auxiliary/AtomicReference";
import { create as createAtomicReference } from "./AtomicReference.impl.js";

/**
 * Create an AutoCloseOne instance.
 * @returns the AutoCloseOne implementation
 */
export function create(): RequiredType<AutoCloseOne> {
  return AutoCloseOneImpl.internalCreate();
}

// ---- Implementation details below ----

/**
 * AutoCloseOne implementation.
 */
class AutoCloseOneImpl implements AutoCloseOne {
  close(): void {
    let autoClose = this.#reference.get();
    if (isPresent(autoClose) && this.#reference.compareAndSet(autoClose, null)) {
      autoClose.close();
    }
  }

  [Symbol.dispose](): void {
    this.close();
  }

  set(newClose: OptionalType<AutoCloseType>): void {
    const current = this.#reference.get();
    const validNewClose = isPresent(newClose) ? typeToAutoClose(newClose) : newClose;

    if (unwrapAutoClose(current) === unwrapAutoClose(validNewClose)) {
      return; // no change
    }

    try {
      this.close(); // close current value if present
    } finally {
      this.#reference.set(validNewClose);
    }
  }

  static internalCreate(): RequiredType<AutoCloseOne> {
    return new AutoCloseOneImpl();
  }

  private constructor() {
    // empty
  }

  readonly #reference: AtomicReference<AutoClose> = createAtomicReference<AutoClose>();
}


