import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { guardFunctions, RequiredType } from "@jonloucks/contracts-ts/api/Types";

/**
 * Opt-in interface to be called once after creation, although implementations should
 * handle this gracefully. For example, this is when threads or hooks could be added.
 * will automatically call this method once if the deliverable implements this method.
 */
export interface AutoOpen { // Intentionally does not extend the Open interface

    /**
     * AutoOpen this instance
     * @return the mechanism to shut down
     */
    autoOpen(): AutoClose;
}

/**
 * Duck-typing check for AutoOpen interface.
 * 
 * @param instance the instance to check
 * @returns true if the instance implements AutoOpen, false otherwise
 */
export function guard(instance: unknown): instance is RequiredType<AutoOpen> {
    return guardFunctions(instance, 'autoOpen');
}


