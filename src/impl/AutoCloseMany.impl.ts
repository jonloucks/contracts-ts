import { AutoClose, AutoCloseMany, AutoCloseType, fromType as typeToAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Internal } from "./Internal.impl.js";

/**
 * Create an AutoCloseMany instance.
 *
 * @returns the AutoCloseMany implementation
 */
export function create(): RequiredType<AutoCloseMany> {
  return AutoCloseManyImpl.internalCreate();
}

// ---- Implementation details below ----

/**
 * AutoCloseMany implementation.
 */
class AutoCloseManyImpl implements AutoCloseMany {

  add(closeable: RequiredType<AutoCloseType>): void {
    this.#closeables.push(typeToAutoClose(closeable));
  }

  close(): void {
    const errorList: unknown[] = [];
    while (this.#closeables.length > 0) {
      try {
        this.#closeables.pop()?.close();
      } catch (error) {
        errorList.push(error);
      }
    }
    if (errorList.length > 0) {
      Internal.throwAggregateError("Multiple while closing.", ...errorList);
    }
  }

  [Symbol.dispose](): void {
    this.close();
  }

  static internalCreate(): RequiredType<AutoCloseMany> {
    return new AutoCloseManyImpl();
  }

  private constructor() {
  }


  readonly #closeables: RequiredType<AutoClose>[] = [];
};