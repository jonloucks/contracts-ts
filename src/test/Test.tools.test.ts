import assert from 'node:assert';

import { AssertionError, AssertPredicate } from 'node:assert';
import { isRequiredConstructor, OptionalType, RequiredType } from "../api/Types";
import { configCheck, nullCheck } from "../api/Checks";
import { IllegalStateException } from "../api/IllegalStateException";
import { Contracts, Config as ContractsConfig } from "../api/Contracts";
import { Contract, Config as ContractConfig } from "../api/Contract";
import { AutoClose } from "../api/AutoClose";
import { ClassCastException } from "../api/ClassCastException";
import { createContract, createContracts } from "../index"

describe('test utilities', () => {
    it('Dummy test', () => {
        assert.strictEqual(true, !false);
    });
});

/**
 * Contracts testing tools.
 * These utilities are supported for public use.
 * They will follow the symantec versioning just like the production code
 */
export class Tools {
    private constructor() {
        throw new IllegalStateException('Illegal constructor call.');
    }

    public static assertAll(...all: (() => unknown)[]): void {
        if (all) {
            for (const item of all) {
                if (item) {
                    item();
                }
            }
        }
    }

    public static assertTrue(condition: boolean, message?: string) {
        assert.strictEqual(condition, true, message);
    }

    public static assertFalse(condition: boolean, message?: string) {
        assert.strictEqual(condition, false, message);
    }

    public static assertEquals(expected: unknown, actual: unknown, message?: string) {
        assert.strictEqual(actual, expected, message);
    }

    public static assertSame(expected: unknown, actual: unknown, message?: string) {
        assert.equal(actual, expected, message);
    }

    public static isUpperCase(char: string): boolean {
        return char === char.toUpperCase() && char !== char.toLowerCase();
    }

    public static assertNotNull(value: unknown, message?: string) {
        assert.ok(value, message); // Passes if truthy
        assert.notStrictEqual(value, null, message);
    }

    public static assertNull(value: unknown, message?: string) {
        assert.strictEqual(value, null, message);
    }

    public static assertUndefined(value: unknown, message?: string) {
        assert.strictEqual(value, undefined, message);
    }

    public static assertThrows<T extends Error | string>(predicate: AssertPredicate, executable: () => unknown, message?: string): RequiredType<T> {
        let validExecutable: (() => unknown) = nullCheck(executable, "Executable must be present.");

        let actual: unknown = null;

        assert.throws(
            validExecutable,
            (thrown) => {
                actual = thrown;
                return true
            });

        if (actual === null || actual === undefined) {
            throw new AssertionError({ message: message ?? "Expected exception to be thrown." });
        }
        if (actual instanceof Error) {
            Tools.applyAssertPredicate<T>(predicate, actual as Error);
        }
        return actual as T;
    }

    private static applyAssertPredicate<T extends Error | string>(predicate: AssertPredicate, actual: Error) {
        if (!predicate) {
            return;
        } else if (isRequiredConstructor(predicate)) {
            const expectedType = predicate as new () => object;
            if (!(actual instanceof expectedType)) {
                throw new AssertionError({ message: `Error was not instance of expected type ${expectedType.name}.` });
            }
        } else if (predicate instanceof RegExp) {
            if (!predicate.test(actual.message)) {
                throw new AssertionError({ message: `Error message "${actual.message}" did not match pattern: ${predicate}.` });
            }
        } else if (typeof predicate === 'string') {
            if (actual.message !== predicate) {
                throw new AssertionError({ message: `Error message "${actual.message}" did not match message: ${predicate}.` });
            }
        } else if (predicate instanceof Error) {
            if (actual.constructor !== predicate.constructor || actual.message !== predicate.message) {
                throw new AssertionError({ message: `Error  "${actual}" did not match pattern: ${predicate}.` });
            }
        } else if (typeof predicate === 'function') {
            if (!predicate(actual)) {
                throw new AssertionError({ message: `Error did not match predicate.` });
            }
        }
    }

    /**
     * For testing assertions methods
     *x
     * @param executable the test that is expected to fail
     */
    public static assertFails(executable: () => unknown) {
        let validExecutable: (() => unknown) = nullCheck(executable, "Executable must be present.");
        let thrown: AssertionError = Tools.assertThrows(AssertionError, validExecutable, "Expected AssertionError to be thrown.");
        Tools.assertObject(thrown, "Thrown must be an object.");
        Tools.assertNotNull(thrown.message, "Message must be present.");
    }

    // public static assertFails(executable: () => unknown, message?: string) {
    //     let validExecutable: (() => unknown) = nullCheck(executable, "Executable must be present.");

    //     assert.throws(validExecutable, AssertionError, message ?? "Expected AssertionError to be thrown.");
    // }

    /**
     * Assert that an object complies with basic expectations
     *
     * @param instance the object to check
     */
    public static assertObject(instance: unknown, message?: string) {
        class Unknown { }
        const unknown = new Unknown();

        Tools.assertNotNull(instance, message ?? "Object must be present.");

        if (typeof instance === 'object') {
            let object: object = instance as object;
            Tools.assertNotNull(object.toString(), "Object toString() was null.");
        }
    }

    /**
     * Asserts that a class can NOT be instantiated
     *
     * @param theClass the class to check
     */
    public static assertInstantiateThrows(type: (new () => unknown)) {
        Tools.assertThrows<Error>(Error, () => {
            new type();
        });
    }

    /**
     * Assert the exception matches the exact specifications
     *
     * @param thrown the thrown exception
     * @param cause the cause of the thrown exception
     * @param reason the reason (message) of the exception
     */
    public static assertExpectedError(thrown: Error, cause: Error | null, reason: string): void {
        Tools.assertObject(thrown);

        Tools.assertAll(
            () => Tools.assertMessage(thrown.message),
            // () => Tools.assertEquals(cause, thrown.cause, "The cause should match."),
            () => Tools.assertEquals(reason, thrown.message, "The reason should match."),
            () => Tools.assertNotNull(thrown.toString(), "The toString() should not be null.")
        );
    }

    /**
     * Assert the error message complies with best practices
     *
     * @param message the message to check
     */
    public static assertMessage(message: string): void {
        Tools.assertNotNull(message, "Message must be present.");
        Tools.assertFalse(message.length === 0, "Message should not be empty.");
        Tools.assertTrue(Tools.isUpperCase(message.charAt(0)), "Message should start with a upper case character.");
        Tools.assertEquals('.', message.charAt(message.length - 1), "Message should end with a dot: " + message + ".");
    }

    /**
     * Assert the thrown exception complies with best practices
     *
     * @param thrown the thrown exception
     */
    public static assertThrown(thrown: unknown): void {
        Tools.assertNotNull(thrown, "Thrown must be present.");

        if (typeof thrown === 'string') {
            Tools.assertMessage(thrown);
            return;
        } else if (thrown instanceof Error) {
            Tools.assertExpectedError(thrown, null, thrown.message);
        }

    }

    //     /**
    //      * Assert the thrown exception complies with best practices
    //      * and has matching cause
    //      *
    //      * @param thrown the thrown exception
    //      * @param cause the cause
    //      */
    //     public static void assertThrown(Throwable thrown, Throwable cause) {
    //         assertNotNull(thrown, "Thrown must be present.");

    //         assertThrown(thrown, cause, thrown.getMessage());
    //     }

    //     /**
    //      * Assert the thrown exception complies with best practices
    //      * and a matching reason
    //      *
    //      * @param thrown the thrown exception
    //      * @param reason the expected message or reason
    //      */
    //     public static void assertThrown(Throwable thrown, String reason) {
    //         assertNotNull(thrown, "Thrown must be present.");

    //         assertThrown(thrown, thrown.getCause(), reason);
    //     }

    /**
     *  Run an execution block and validated it throws the expected type of exception
     *
     * @param possibleType the possible type of exception
     * @param executable the executable block which may throw the possible exception type
     * @param <E> the type of exception
     */
    public static assertThrowsCompliantError(possibleType: AssertPredicate, executable: () => unknown): Error | string {
        const error = Tools.assertThrows(possibleType, executable);
        Tools.assertThrown(error);
        return error;
    }

    //     /**
    //      * Run an execution block and validated it throws the expected type of exception, and it has
    //      * a matching reason
    //      *
    //      * @param possibleType the possible type of exception
    //      * @param executable the executable block which may throw the possible exception type
    //      * @param reason the expected error message
    //      * @param <E> the type of exception
    //      */
    //     public static <E extends Throwable> void assertThrown(Class<E> possibleType, Executable executable, String reason) {
    //         assertThrown(assertThrows(possibleType, executable), reason);
    //     }

    //     /**
    //      * For scenarios that may or may not throw an exception. This can occur in where the behavior
    //      * is undefined, but if the implementation decides to throw an exception it must be a certain type
    //      *
    //      * @param allowedType the allowed possible thrown type
    //      * @param executable the block of code which may throw an exception
    //      * @return the optional thrown
    //      * @param <E> the type of error message
    //      */
    //     public static <E extends Throwable> Optional<E> assertMayThrow(Class<E> allowedType, Executable executable) {
    //         Class<E> validAllowedTyped = typeCheck(allowedType);
    //         Executable validExecutable = nullCheck(executable, "Executable must be present.");
    //         try {
    //             validExecutable.execute();
    //             return Optional.empty();
    //         } catch (Throwable thrown) {
    //             assertThrownType(validAllowedTyped, thrown, null);
    //             return Optional.empty();
    //         }
    //     }

    //     /**
    //      * Assert the Throwable is a instance of the allowed type
    //      *
    //      * @param allowedType the allowed type
    //      * @param thrown the actual thrown
    //      * @param reason the error message if AssertError is thrown
    //      * @param <E> the type of exception
    //      */
    //     public static <E extends Throwable> void assertThrownType(Class<E> allowedType, Throwable thrown, String reason) {
    //         Class<E> validAllowedTyped = typeCheck(allowedType);
    //         Throwable validThrown = nullCheck(thrown, "Thrown must be present.");

    //         if (validAllowedTyped.isInstance(validThrown)) {
    //             return;
    //         }
    //         throw assertionFailure() //
    //             .message(reason) //
    //             .expected(validAllowedTyped) //
    //             .actual(validThrown.getClass()) //
    //             .reason("Unexpected exception type thrown.") //
    //             .cause(validThrown) //
    //             .build();
    //     }

    /**
     * Assert a Contract is valid
     *
     * @param contract the contract to check
     * @param config the expected configuration
     * @param valid  a valid value
     * @param <T> the type of deliverable
     */
    public static assertContract<T>(contract: Contract<T>, config: ContractConfig<T>, valid: T): void {
        Tools.assertNotNull(contract, "Contract must not be null.");

        Tools.assertAll(
            () => Tools.assertObject(contract),
            () => Tools.assertSame(config.cast?.(valid), contract.cast(valid), "Casting a valid value should work."),
            () => Tools.assertNull(contract.cast(null), "Casting null should return null."),
            () => Tools.assertNull(contract.cast(undefined), "Casting null should return null."),
            () => Tools.assertThrows(ClassCastException, () => contract.cast(undefined), "Invalid cast should thrown."),
            () => Tools.assertSame(config.typeName, contract.typeName, "Contract type mismatch."),
            () => Tools.assertSame(config.name, contract.name, "Contract name mismatch."),
            () => Tools.assertSame(config.replaceable, contract.replaceable, "Contract replacement mismatch.")
        );
    }

    /**
     * When cleaning before and after tests.
     * The strategy is to execute all sanitizers, ignoring any errors.
     *
     * @param sanitizers the things to sanitize
     */
    public static sanitize(...sanitizers: (() => unknown)[]): void {
        if (sanitizers) {
            for (const sanitizer of sanitizers) {
                if (sanitizer) {
                    try {
                        sanitizer();
                    } catch (ignored) {
                    }
                }
            }
        }
    }

    /**
     * Clean state from the testing context.
     */
    public static clean(): void {
        Tools.sanitize(() => {
            // init();
        });
    }

    /**
     * Do nothing for a period of time (Non-busy-wait)
     *
     * @param duration how long to sleep
     */
    public static async asyncsleep(duration: Duration) {
        const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        await sleep(duration.milliseconds ? duration.milliseconds() : 4);
    }

    /**
     * Enclosure that receives a new Contracts for testing
     * Note: The Contracts will be automatically closed after consumer block returns
     *
     * @param consumerBlock the consumer of the new Contracts
     */
    public static withContracts(consumerBlock: ContractsConsumer): void {
        Tools.withConfiguredContracts({ ratified: false }, consumerBlock);
    }

    /**
     * Enclosure that receives a new Contracts for testing
     * Note: The Contracts will be automatically closed after consumer block returns
     *
     * @param config The configuration for the new Contracts
     * @param consumerBlock the consumer of the new Contracts
    */
    public static withConfiguredContracts(config: OptionalType<ContractsConfig>, consumerBlock: ContractsConsumer): void {
        const validConfig: ContractsConfig = configCheck(config);
        const validConsumerBlock: (c: Contracts) => void = nullCheck(consumerBlock, "Block must be present.");
        const contracts: RequiredType<Contracts> = createContracts(validConfig);
        using usingContracts: AutoClose = contracts.open();

        validConsumerBlock(contracts);
    }

    public static withPartnerContracts(consumerBlock: PartnerConsumer): void {
        Tools.withContracts((partner: Contracts) => {
            const primaryConfig: ContractsConfig = {
                partners: [partner]
            }
            Tools.withConfiguredContracts(primaryConfig, (primary: Contracts) => {
                consumerBlock(primary, partner);
            });
        });
    }
    /**
    * Closes the AutoClose, used to avoid getting explicit close warnings in tests.
    *
    * @param autoClose the instance to close
    * @throws IllegalArgumentException when arguments are null
    */
    public static implicitClose(autoClose: AutoClose): void {
        const validClose: AutoClose = nullCheck(autoClose, "AutoClose must be present.");
        validClose.close();
    }

    /**
     * Assert close can be called more than once without producing an exception
     *
     * @param autoClose the AutoClose to close
     * @throws IllegalArgumentException when arguments are null
     */
    public static assertIdempotent(autoClose: AutoClose): void {
        const validClose: AutoClose = nullCheck(autoClose, "AutoClose must be present.");
        for (let n = 0; n < 7; n++) {
            assert.doesNotThrow(() => Tools.implicitClose(validClose), "AutoClose should be idempotent.");
            Tools.assertObject(autoClose); // should not become a landmine
        }
    }

    /**
     * Used to avoid warnings about unused variables in tests. try-with-resource unused, which is NOT a good warning.
     *
     * @param ignored not used
     */
    // @SuppressWarnings({"unused", "EmptyMethod"})
    public static ignore(ignored: unknown): void {
    }

    public static createStringContract(): Contract<string> {
        return createContract<string>({
            test: (value: unknown): value is string => {
                return value == null || value == undefined || typeof value === 'string';
            },
            typeName: "string",
            name: "String Contract",
            replaceable: false
        });
    }
}

export type ContractsConsumer = (contracts: Contracts) => void;
export type PartnerConsumer = (primary: Contracts, partner: Contracts) => void;
export interface Duration {
    milliseconds(): number;
};




