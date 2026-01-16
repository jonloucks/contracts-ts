import { AutoClose, Contract, Contracts, CONTRACTS, createContract, createContracts, hasFunctions, PROMISOR_FACTORY, PromisorFactory } from "@io.github.jonloucks/contracts-ts";
import { notStrictEqual, ok, strictEqual } from "node:assert";

// Define a service interface, a Contract can be for any type.
interface Logger {
  log(message: string): void;
}

// Create a contract for the service
const LOGGER_CONTRACT: Contract<Logger> = createContract<Logger>({
  name: "Logger", // Optional name for the contract

  // Define how to test if an object satisfies the Logger interface
  test: (obj: unknown): obj is Logger => {
    return hasFunctions(obj, 'log'); // Example of using hasFunctions utility
  }
});

describe("Example Logger Service Contract", () => {

  // Create a Contracts container
  const DEBUG = false;

  let closeBinding: AutoClose;

  it("Bind logging service contract to a Promisor", () => {
    // Optional - PromisorFactory is not required, but provides trivial and advanced ways to create a Promisor
    let promisorFactory = CONTRACTS.enforce<PromisorFactory>(PROMISOR_FACTORY);

    closeBinding = CONTRACTS.bind<Logger>(LOGGER_CONTRACT,
      promisorFactory.createSingleton<Logger>(
        () => ({
          log: (message: string) : void => {
            if (DEBUG) {
              console.log("LOG:", message);
            }
          }
        })));
  });

  it("Optional - Check if logging service is bound", () => {
    const isLoggerBound: boolean = CONTRACTS.isBound(LOGGER_CONTRACT);
    strictEqual(isLoggerBound, true, "Logger should be bound");
  });

  it("Use logging service", () => {
    const logger: Logger = CONTRACTS.enforce<Logger>(LOGGER_CONTRACT);
    notStrictEqual(logger, null, "Logger should be enforced and not null");
    logger.log("Using the service in the test.");
  });

  it("Close Contract Binding", () => {
    closeBinding.close(); // It will be closed by closeContracts, but we can close it earlier if desired
  });
});

