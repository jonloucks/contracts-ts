import { AutoClose, AutoCloseType, typeToAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { AutoOpen, guard as guardAutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
import { guardFunctions, isFunction } from "@jonloucks/contracts-ts/api/Types";
import { RequiredType } from "@jonloucks/contracts-ts/api/AutoCloseFactory";

/**
 * Interface representing an entity that can be opened, returning an AutoClose mechanism.
 */
export interface Open {

  /**
   * Open this instance.
   * @return the mechanism to close
   */
  open(): AutoClose; // Review changing to union type AutoCloseType
}

/**
 * The type used to open an Idempotent
 */
export type OpenType = AutoOpen | Open | (() => AutoCloseType);

/**
 * Duck-typing check for Open interface.
 *
 * @param value the value to check
 * @returns true if the value implements Open, false otherwise
 */
export function guard(value: unknown): value is RequiredType<Open> {
  return guardFunctions(value, 'open');
}

/**
 * Convert an OpenType to an Open instance.
 *
 * @param type the OpenType to convert
 * @return the Open instance
 */
export function typeToOpen(type: OpenType): Open {
  if (guardAutoOpen(type)) {
    return {
      open: () => type.autoOpen()
    }
  } else if (guard(type)) {
    return type;
  } else if (isFunction(type)) {
    return {
      open: () => typeToAutoClose(type())
    };
  } else {
    throw new Error("Invalid Open type.");
  }
}