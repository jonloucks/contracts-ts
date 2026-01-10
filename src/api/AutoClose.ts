import { OptionalType, RequiredType, hasFunctions } from "./Types";

/**
 * Opt-in interface to  For example, this is when threads should be stopped or hooks removed.
 * See also {@link AutoOpen}
 * Features like life cycle promisors
 * will automatically call this method once if the deliverable implements this method.
 */
export interface AutoClose {

    /**
     * AutoClose this instance.
     */
    close(): void;

    /**
     * Dispose this instance.
     */
    [Symbol.dispose](): void;
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
 * Convert a simple runnable into an AutoClose with dispose
 * 
 * @param action the runnable action to perform on close/dispose
 * @returns the AutoClose instance
 */
export function inlineAutoClose(action: () => void): RequiredType<AutoClose> {
    return {
        close: action,
        [Symbol.dispose]: action
    };
}

/**
 * Duck-typing check for AutoClose interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AutoClose, false otherwise
 */
export function isAutoClose(instance: unknown): instance is OptionalType<AutoClose> {
    return hasFunctions(instance, 'close', '[Symbol.dispose]');
}

