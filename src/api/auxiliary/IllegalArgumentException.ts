import { messageCheck } from "@io.github.jonloucks/contracts-ts/api/auxiliary/Checks";

/**
 * Exception thrown when an illegal argument is provided.
 * Note: This can not extend ContractException due to circular dependency.
 */
export class IllegalArgumentException extends Error {
  constructor(message: string, _thrown: Error | null = null) {
    // super(messageCheck(message), thrown || undefined);
    super(messageCheck(message));

    this.name = "IllegalArgumentException";
    Object.setPrototypeOf(this, IllegalArgumentException.prototype)
  }
}


