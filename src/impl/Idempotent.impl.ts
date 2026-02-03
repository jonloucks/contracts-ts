import { Idempotent, Config } from "@jonloucks/contracts-ts/auxiliary/Idempotent";
import { IdempotentState } from "@jonloucks/contracts-ts/auxiliary/IdempotenState";
import { AUTO_CLOSE_NONE, AutoClose, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Open, typeToOpen } from "@jonloucks/contracts-ts/api/Open";
import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { AtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/AtomicBoolean";

import { create as createAtomicBoolean } from "./AtomicBoolean.impl";

/** 
 * Create a new Idempotent
 *
 * @param config the idempotent configuration
 * @return the new Idempotent
 */
export function create(config: Config): Idempotent {
  return IdempotentImpl.internalCreate(config);
}

// ---- Implementation details below ----

const IS_CLOSED: boolean = false;
const IS_OPEN: boolean = true;

class IdempotentImpl implements Idempotent {

  // Idempotent.getState
  getState(): IdempotentState {
    return this.#idempotentState;
  }

  // Idempotent.open
  open(): AutoClose {
    if (this.transitionToOpen()) {
      return this.firstOpen();
    } else {
      return AUTO_CLOSE_NONE;
    }
  }

  // Idempotent.isOpen
  isOpen(): boolean {
    return this.#flag.get() === IS_OPEN;
  }

  static internalCreate(config: Config): Idempotent {
    return new IdempotentImpl(config);
  }

  private firstOpen(): AutoClose {
    this.#idempotentState = "OPENING";
    try {
      this.#closeDelegate = this.openDelegate();
      this.#idempotentState = "OPENED";
    } catch (thrown) {
      this.#flag.set(IS_CLOSED);
      this.#idempotentState = "OPENABLE";
      throw thrown;
    }
    return this.#firstClose;
  }

  private openDelegate(): AutoClose {
    return presentCheck(this.#delegate.open(), "Close must be present.");
  }

  private transitionToOpen(): boolean {
    return this.#flag.compareAndSet(IS_CLOSED, IS_OPEN);
  }

  private transitionToClosed(): boolean {
    return this.#flag.compareAndSet(IS_OPEN, IS_CLOSED);
  }

  private constructor(config: Config) {
    this.#delegate = typeToOpen(config.open);
    this.#firstClose = inlineAutoClose(() => {
      if (this.transitionToClosed()) {
        this.#idempotentState = "CLOSING";
        try {
             this.#closeDelegate?.close();
        } finally {
          this.#closeDelegate = undefined;
          this.#idempotentState = "CLOSED";
        }
      }
    });
  }

  readonly #delegate: Open;
  readonly #firstClose: AutoClose;
  readonly #flag: AtomicBoolean = createAtomicBoolean(IS_CLOSED);
  #closeDelegate: AutoClose | undefined = undefined;
  #idempotentState: IdempotentState = "OPENABLE";
}
