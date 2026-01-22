import { OptionalType, RequiredType, guardFunctions, isNotPresent } from "@jonloucks/contracts-ts/api/Types";
import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { IllegalArgumentException } from "@jonloucks/contracts-ts/auxiliary/IllegalArgumentException";

/**
 * Type alias for AutoClose or a simple close function.
 */
export type AutoCloseType = AutoClose | Close | (() => unknown);

/**
 * Interface for a closeable resource.
 */
export interface Close {
  /**
   * Close this instance.
   */
  close(): void;
}

/**
 * Opt-in interface for resources that need cleanup when their lifecycle ends. For example, this is when threads should be stopped or hooks removed.
 * See also {@link AutoOpen}
 * Features like life cycle promisors
 * will automatically call this method once if the deliverable implements this method.
 */
export interface AutoClose extends Close {
  /**
   * Dispose this instance.
   */
  [Symbol.dispose](): void;
}

/**
 * Interface for managing many closeable resources.
 */
export interface AutoCloseMany extends AutoClose {

  /**
   * Add a closeable resource to the list.
   * Note: there are no guards against adding the same resource multiple times.
   * 
   * @param closeable the closeable resource to add
   */
  add(closeable: RequiredType<AutoCloseType>): void;
}

/**
 * Interface for a single closeable resource.
 */
export interface AutoCloseOne extends AutoClose {

  /**
   * Add a closeable resource to the list.
   * 
   * @param closeable the closeable resource to add or null to clear
   */
  set(closeable: OptionalType<AutoCloseType>): void;
}

/**
 * A no-op AutoClose instance that does nothing on close or dispose.
 */
export const AUTO_CLOSE_NONE: AutoClose = {

  /**
   * AutoClose.close override
   */
  close: () => {
    // no-op
  },

  /**
   * AutoClose[Symbol.dispose] override
   */
  [Symbol.dispose]: () => {
    // no-op
  }
};

/**
 * 
 */
export interface AutoCloseWrapper extends AutoClose {

  /**
   * Unwrap to get the original AutoCloseType.
   */
  unwrapAutoCloseType(): RequiredType<AutoCloseType>;
}

/**
 * Check if an instance is an AutoCloseWrapper
 * @param instance the instance to check
 * @returns true if the instance is an AutoCloseWrapper, false otherwise
 */
function guardAutoCloseWrapper(instance: unknown): instance is RequiredType<AutoCloseWrapper> {
  return guardFunctions(instance, 'unwrapAutoCloseType');
} 

/**
 * Convert a simple runnable into an AutoClose with dispose
 * 
 * @param action the runnable action to perform on close/dispose
 * @returns the AutoClose instance
 */
export function inlineAutoClose(action: () => void): RequiredType<AutoCloseWrapper> {
  return {
    close: action,
    [Symbol.dispose]: action,
    unwrapAutoCloseType: () => action
  };
}

/**
 * Unwrap an AutoClose to get the original type.
 * 
 * @param autoClose the AutoClose to unwrap
 * @returns the original AutoCloseType
 */
export function unwrapAutoClose(autoClose: OptionalType<AutoClose>): OptionalType<AutoCloseType> {
  if (isNotPresent(autoClose)) {
    return autoClose;
  }
  if (guardAutoCloseWrapper(autoClose)) {
    return autoClose.unwrapAutoCloseType();
  }
  return autoClose;
}

/**
 * Duck-typing check for AutoClose interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AutoClose, false otherwise
 */
export function guard(instance: unknown): instance is RequiredType<AutoClose> {
  return guardFunctions(instance, 'close', Symbol.dispose);
}

/**
 * Duck-typing check for object with close() method.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AutoClose, false otherwise
 */
export function isClose(instance: unknown): instance is RequiredType<AutoClose> {
  return guardFunctions(instance, 'close');
}

/**
 * Convert an AutoCloseType to an AutoClose
 * @param type the type to convert
 * @returns the AutoClose
 */
export function typeToAutoClose(type: RequiredType<AutoCloseType>): RequiredType<AutoClose> {
  const presentType = presentCheck(type, "AutoClose type must be present.");
  if (guard(presentType)) {
    return presentType;
  } else if (isClose(presentType)) {
    return inlineAutoClose(() => presentType.close());
  } else if (typeof presentType === 'function') {
    return inlineAutoClose(presentType as () => unknown);
  } else {
    throw new IllegalArgumentException("Invalid AutoClose type.");
  }
}



