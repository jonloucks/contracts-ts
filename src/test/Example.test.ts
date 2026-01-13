import assert from "node:assert";
import { createContract, createContracts, Contracts, Contract, PromisorFactory, PROMISOR_FACTORY, AutoClose, hasFunctions } from "../index";

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
    const CONTRACTS: Contracts = createContracts();
    const DEBUG = false;

    let closeContracts: AutoClose;
    let closeBinding: AutoClose;
    it("Open Contracts", () => {
        // Open the Contracts container
        closeContracts = CONTRACTS.open();

        assert.ok(closeContracts, "Contracts container should be opened");
    });

    it("Bind logging service contract to a Promisor", () => {
        // Optional - PromisorFactory is not required, but provides trivial and advanced ways to create a Promisor
        let promisorFactory = CONTRACTS.enforce<PromisorFactory>(PROMISOR_FACTORY);

        closeBinding = CONTRACTS.bind<Logger>(LOGGER_CONTRACT,
            promisorFactory.createSingleton<Logger>(
                () => ({
                    log: (message: string) => {
                        if (DEBUG) {
                            console.log("LOG:", message);
                        }
                    }
                })));
    });

    it("Optional - Check if logging service is bound", () => {
        const isLoggerBound : boolean = CONTRACTS.isBound(LOGGER_CONTRACT);
        assert.strictEqual(isLoggerBound, true, "Logger should be bound");
    });

    it("Use logging service", () => {
        const logger : Logger = CONTRACTS.enforce<Logger>(LOGGER_CONTRACT);
        assert.notStrictEqual(logger, null, "Logger should be enforced and not null");
        logger.log("Using the service in the test.");
    });

    it("Close Contracts", () => {
        closeBinding.close(); // It will be closed by closeContracts, but we can close it earlier if desired
        closeContracts.close();
    });
});

