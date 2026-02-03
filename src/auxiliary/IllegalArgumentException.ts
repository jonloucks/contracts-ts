import { messageCheck, used } from "@jonloucks/contracts-ts/auxiliary/Checks";

/**
 * Exception thrown when an illegal argument is provided.
 * Note: This can not extend ContractException due to circular dependency.
 */
export class IllegalArgumentException extends Error {
  constructor(message: string, thrown: Error | null = null) {
    // super(messageCheck(message), thrown || undefined);
    super(messageCheck(message));
    used(thrown);
    this.name = "IllegalArgumentException";
    Object.setPrototypeOf(this, IllegalArgumentException.prototype)
  }
}


