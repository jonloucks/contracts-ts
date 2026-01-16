import { AutoClose, AutoCloseOne, AutoCloseType, typeToAutoClose, unwrapAutoClose } from "@io.github.jonloucks/contracts-ts/api/AutoClose";
import { AtomicReference } from "@io.github.jonloucks/contracts-ts/api/auxiliary/AtomicReference";
import { isPresent, OptionalType, RequiredType } from "@io.github.jonloucks/contracts-ts/api/auxiliary/Types";
import { create as createAtomicReference } from "@io.github.jonloucks/contracts-ts/impl/AtomicReference.impl";

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
    let autoClose = this.reference.get();
    if (isPresent(autoClose) && this.reference.compareAndSet(autoClose, null)) {
      autoClose.close();
    }
  }

  [Symbol.dispose](): void {
    this.close();
  }

  set(newClose: OptionalType<AutoCloseType>): void {
    const current = this.reference.get();
    const validNewClose = isPresent(newClose) ? typeToAutoClose(newClose) : newClose;

    if (unwrapAutoClose(current) === unwrapAutoClose(validNewClose)) {
      return; // no change
    }

    try {
      this.close(); // close current value if present
    } finally {
      this.reference.set(validNewClose);
    }
  }

  static internalCreate(): RequiredType<AutoCloseOne> {
    return new AutoCloseOneImpl();
  }

  private constructor() {
    // empty
  }

  private readonly reference: AtomicReference<AutoClose> = createAtomicReference<AutoClose>();
}


