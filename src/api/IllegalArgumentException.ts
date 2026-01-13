import { messageCheck } from "contracts-ts/api/Checks";

/**
 * Exception thrown when an illegal argument is provided.
 * Note: This can not extend ContractException due to circular dependency.
 */
export class IllegalArgumentException extends Error {
    constructor(message: string, thrown: Error | null = null) {
        // super(messageCheck(message), thrown || undefined);
        super(messageCheck(message));

        this.name = "IllegalArgumentException";
        Object.setPrototypeOf(this, IllegalArgumentException.prototype)
    }
}


