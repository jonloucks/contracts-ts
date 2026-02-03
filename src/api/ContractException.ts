import { messageCheck, used } from "@jonloucks/contracts-ts/auxiliary/Checks";

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
  public constructor(message: string, thrown: Error | null = null) {
    // super(messageCheck(message), thrown || undefined);
    super(messageCheck(message));

    used(thrown);

    this.name = "ContractException";
    Object.setPrototypeOf(this, ContractException.prototype)
  }

  /**
   * Ensure something that was caught is rethrown as a ContractException
   * @param caught the caught value
   * @param message the optional message to use if caught is not an ContractException
   */
  static rethrow(caught: unknown, message?: string): never {
    if (guard(caught)) {
      throw caught;
    } else if (caught instanceof Error) {
      throw new ContractException(message ?? caught.message, caught);
    } else {
      throw new ContractException(message ?? "Unknown type of caught value.");
    }
  }
}

/**
 * Type guard for ContractException
 *
 * @param value the value to check
 * @return true if value is ContractException, false otherwise
 */
export function guard(value: unknown): value is ContractException {
  return value instanceof ContractException;
}

