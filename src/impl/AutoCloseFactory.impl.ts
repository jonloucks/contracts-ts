import { AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType, fromType as typeToAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { AutoCloseFactory } from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { create as createAutoCloseMany } from "./AutoCloseMany.impl.js";
import { create as createAutoCloseOne } from "./AutoCloseOne.impl.js";

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
