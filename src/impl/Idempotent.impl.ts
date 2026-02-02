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
    return this._idempotentState;
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
    return this._flag.get() === IS_OPEN;
  }

  static internalCreate(config: Config): Idempotent {
    return new IdempotentImpl(config);
  }

  private firstOpen(): AutoClose {
    this._idempotentState = "OPENING";
    try {
      this._closeDelegate = this.openDelegate();
      this._idempotentState = "OPENED";
    } catch (thrown) {
      this._flag.set(IS_CLOSED);
      this._idempotentState = "OPENABLE"; // maybe "DESTROYED"
      throw thrown;
    }
    return this._firstClose;
  }

  private openDelegate(): AutoClose {
    return presentCheck(this._delegate.open(), "Close must be present.");
  }

  private transitionToOpen(): boolean {
    return this._flag.compareAndSet(IS_CLOSED, IS_OPEN);
  }

  private transitionToClosed(): boolean {
    return this._flag.compareAndSet(IS_OPEN, IS_CLOSED);
  }

  private constructor(config: Config) {
    this._delegate = typeToOpen(config.open);
    this._firstClose = inlineAutoClose(() => {
      if (this.transitionToClosed()) {
        this._idempotentState = "CLOSING";
        try {
             this._closeDelegate?.close();
        } finally {
          this._closeDelegate = undefined;
          this._idempotentState = "CLOSED";
        }
      }
    });
  }

  private readonly _delegate: Open;
  private readonly _firstClose: AutoClose;
  private readonly _flag: AtomicBoolean = createAtomicBoolean(IS_CLOSED);
  private _closeDelegate: AutoClose | undefined = undefined;
  private _idempotentState: IdempotentState = "OPENABLE";
}
