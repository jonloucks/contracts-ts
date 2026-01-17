import { presentCheck } from "@jonloucks/contracts-ts/api/auxiliary/Checks";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";

/**
 * Helper functions for internal implementations.
 */
export const Internal = {

  /**
   * Iterate over a Map in reverse order, invoking the callback for each entry.
   * 
   * @param map the Map to iterate over
   * @param callback the callback to invoke for each entry
   */
  mapForEachReversed<K, V>(map: Map<K, V>, callback: (key: K, value: V) => void): void {
    const validMap = presentCheck(map, "Map must be present.");
    const entries: [K, V][] = [];
    validMap.forEach((value, key) => {
      entries.push([key, value]);
    });
    while (entries.length > 0) {
      const entry = entries.pop()!;
      callback(entry[0], entry[1]);
    }
  },

  /**
   * Throws an AggregateError with the provided message and list of errors.
   * If only one error is provided, it throws that error directly.
   * 
   * @param message the message for the AggregateError
   * @param errorList the list of errors to include
   */
  throwAggregateError(message: string, ...errorList: unknown[]): never {
    if (errorList.length === 1) {
      throw errorList[0];
    } else {
      // Map each error object to its message property
      const messages = errorList.map(error => `- ${error instanceof Error ? error.message : String(error)}`);

      // Join the messages with a newline separator
      const messagesJoined = messages.join('\n');

      throw new ContractException(message + "\n" + messagesJoined);
    }
  }
}