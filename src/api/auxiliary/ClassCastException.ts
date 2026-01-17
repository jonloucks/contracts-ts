import { messageCheck } from "@jonloucks/contracts-ts/api/auxiliary/Checks";

/**
 * Exception thrown when a class cast fails.
 * Note: This can not extend ContractException due to circular dependency.
 */
export class ClassCastException extends Error {
    constructor(message: string, _thrown: Error | null = null) {
        // super(messageCheck(message), thrown || undefined);
        super(messageCheck(message));

        this.name = "ClassCastException";
        Object.setPrototypeOf(this, ClassCastException.prototype)
    }
}


