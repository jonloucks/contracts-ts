import {
  AutoClose,
  bind,
  claim,
  Contract,
  createSingleton,
  createContract,
  enforce,
  guardFunctions,
  isBound
} from "@jonloucks/contracts-ts/api/Convenience";

import { notStrictEqual, strictEqual } from "node:assert";

// Define a service interface, a Contract can be for any type.
interface Logger {
  log(message: string): void;
}

// Create a contract for the service
const LOGGER_CONTRACT: Contract<Logger> = createContract<Logger>({
  name: "Logger", // Optional name for the contract

  // Define how to test if an object satisfies the Logger interface
  test: (obj: unknown): obj is Logger => {
    return guardFunctions(obj, 'log'); // example of using guardFunctions helper
  }
});

describe("Example Logger Service Contract", () => {

  // Create a Contracts container
  const DEBUG = false;

  let closeBinding: AutoClose;

  it("Bind logging service contract to a Promisor", () => {

    closeBinding = bind<Logger>(LOGGER_CONTRACT,
      createSingleton<Logger>(
        () => ({
          log: (message: string) : void => {
            if (DEBUG) {
              console.log("LOG:", message);
            }
          }
        })));
  });

  it("Optional - Check if logging service is bound", () => {
    const isLoggerBound: boolean = isBound(LOGGER_CONTRACT);
    strictEqual(isLoggerBound, true, "Logger should be bound");
  });

  it("Use logging service", () => {
    const logger: Logger = enforce<Logger>(LOGGER_CONTRACT);
    notStrictEqual(logger, null, "Logger should be enforced and not null");
    strictEqual(claim<Logger>(LOGGER_CONTRACT), logger, "Claimed logger should be the same instance");
    logger.log("Using the service in the test.");
  });

  it("Close Contract Binding", () => {
    closeBinding.close(); // It will be closed by closeContracts, but we can close it earlier if desired
  });
});

