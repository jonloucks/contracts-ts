import { AutoClose, AutoCloseMany, AutoCloseType, typeToAutoClose } from "contracts-ts/api/AutoClose";
import { RequiredType } from "contracts-ts/api/Types";
import { Internal } from "contracts-ts/impl/Internal.impl";

export { AutoCloseMany } from "contracts-ts/api/AutoClose";
export { RequiredType } from "contracts-ts/api/Types";

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
    this.closeables.push(typeToAutoClose(closeable));
  }

  close(): void {
    const errorList: unknown[] = [];
    while (this.closeables.length > 0) {
      try {
        this.closeables.pop()?.close();
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


  private closeables: RequiredType<AutoClose>[] = [];
};