import { messageCheck } from "@jonloucks/contracts-ts/api/auxiliary/Checks";

/**
 * Runtime exception thrown for Contract related problems.
 * For example, when claimed contract is not bound to a promisor.
 */
export class ContractException extends Error {

  /**
   * Passthrough for {@link Error(String, Throwable)}
   *
   * @param message the message for this exception
   * @param thrown  the cause of this exception, null is allowed
   */
  public constructor(message: string, _thrown: Error | null = null) {
    // super(messageCheck(message), thrown || undefined);
    super(messageCheck(message));

    this.name = "ContractException";
    Object.setPrototypeOf(this, ContractException.prototype)
  }

  /**
   * Ensure something that was caught is rethrown as a ContractException
   * @param caught the caught value
   * @param message the optional message to use if caught is not an ContractException
   */
  static rethrow(caught: unknown, message?: string): never {
    if (caught instanceof ContractException) {
      throw caught;
    } else if (caught instanceof Error) {
      throw new ContractException(message ?? caught.message, caught);
    } else {
      throw new ContractException(message ?? "Unknown type of caught value.");
    }
  }
}

