import { AutoClose } from "./AutoClose";
import { guardFunctions } from "./Types";
import { RequiredType } from "./AutoCloseFactory";

/**
 * Interface representing an entity that can be opened, returning an AutoClose mechanism.
 */
export interface Open {

  /**
   * Open this instance.
   * @return the mechanism to close
   */
  open(): AutoClose;
}

/**
 * Duck-typing check for Open interface.
 *
 * @param value the value to check
 * @returns true if the value implements Open, false otherwise
 */
export function guard(value: unknown): value is RequiredType<Open> {
  return guardFunctions(value, 'open');
}