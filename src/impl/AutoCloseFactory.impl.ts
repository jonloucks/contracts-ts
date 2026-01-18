import { AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType, typeToAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { AutoCloseFactory } from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { create as createAutoCloseMany } from "@jonloucks/contracts-ts/impl/AutoCloseMany.impl";
import { create as createAutoCloseOne } from "@jonloucks/contracts-ts/impl/AutoCloseOne.impl";

export { AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType } from "@jonloucks/contracts-ts/api/AutoClose";
export { AutoCloseFactory } from "@jonloucks/contracts-ts/api/AutoCloseFactory";
export { RequiredType } from "@jonloucks/contracts-ts/api/Types";

/**
 * Create an AutoCloseFactory instance.
 *
 * @returns the AutoCloseFactory implementation
 */
export function create(): RequiredType<AutoCloseFactory> {
  return AutoCloseFactoryImpl.internalCreate();
}

// ---- Implementation details below ----

/**
 * The AutoCloseFactory implementation
 */
class AutoCloseFactoryImpl implements AutoCloseFactory {

  createAutoClose(type: RequiredType<AutoCloseType>): RequiredType<AutoClose> {
    return typeToAutoClose(type);
  }

  createAutoCloseMany(): RequiredType<AutoCloseMany> {
    return createAutoCloseMany()
  }

  createAutoCloseOne(): RequiredType<AutoCloseOne> {
    return createAutoCloseOne();
  }

  static internalCreate(): RequiredType<AutoCloseFactory> {
    return new AutoCloseFactoryImpl();
  }

  private constructor() {
  }
}
