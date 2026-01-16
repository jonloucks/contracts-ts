import { messageCheck } from "@io.github.jonloucks/contracts-ts/api/auxiliary/Checks";

/**
 * Exception thrown when an operation is invoked at an illegal or inappropriate time. 
 * Note: This can not extend ContractException due to circular dependency.
 */
export class IllegalStateException extends Error {
  constructor(message: string, _thrown: Error | null = null) {
    // super(messageCheck(message), thrown || undefined);
    super(messageCheck(message));

    this.name = "IllegalStateException";
    Object.setPrototypeOf(this, IllegalStateException.prototype)
  }
}


