import { AssertionError, AssertPredicate, doesNotThrow, equal, notStrictEqual, ok, strictEqual, throws } from "node:assert";

import { createContract, createContracts } from "@jonloucks/contracts-ts";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { configCheck, presentCheck } from "@jonloucks/contracts-ts/api/auxiliary/Checks";
import { ClassCastException } from "@jonloucks/contracts-ts/api/auxiliary/ClassCastException";
import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { Contracts, Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
import { isConstructorPresent, isNotPresent, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { IllegalStateException } from "@jonloucks/contracts-ts/auxiliary/IllegalStateException";

describe('all test files need one test, this is test utility class', () => {
  it('Dummy test', () => {
    strictEqual(true, !false, "Dummy test works");
  });
});

/**
 * Contracts testing tools.
 * These utilities are supported for public use.
 * They will follow the semantic versioning just like the production code
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

  public static assertTrue(condition: boolean, message?: string) : void {
    strictEqual(condition, true, message);
  }

  public static assertFalse(condition: boolean, message?: string) : void {
    strictEqual(condition, false, message);
  }

  public static assertEquals(expected: unknown, actual: unknown, message?: string) : void {
    strictEqual(actual, expected, message);
  }

  public static assertSame(expected: unknown, actual: unknown, message?: string) : void {
    equal(actual, expected, message);
  }

  public static isUpperCase(char: string): boolean {
    return char === char.toUpperCase() && char !== char.toLowerCase();
  }

  public static assertNotNull(value: unknown, message?: string) : void {
    ok(value, message); // Passes if truthy
    notStrictEqual(value, null, message);
  }

  public static assertNull(value: unknown, message?: string) : void {
    strictEqual(value, null, message);
  }

  public static assertUndefined(value: unknown, message?: string) : void {
    strictEqual(value, undefined, message);
  }

  public static assertThrows<T extends Error | string>(predicate: AssertPredicate, executable: () => unknown, message?: string): RequiredType<T> {
    let validExecutable: (() => unknown) = presentCheck(executable, "Executable must be present.");

    let actual: unknown = null;

    throws(
      validExecutable,
      (thrown) => {
        actual = thrown;
        return true
      });

    if (isNotPresent(actual)) {
      throw new AssertionError({ message: message ?? "Expected exception to be thrown." });
    }
    if (actual instanceof Error) {
      Tools.applyAssertPredicate(predicate, actual as Error);
    }
    return actual as T;
  }

  private static applyAssertPredicate(predicate: AssertPredicate, actual: Error) : void{
    if (!predicate) {
      return;
    } else if (isConstructorPresent(predicate)) {
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
  public static assertFails(executable: () => unknown) : void {
    let validExecutable: (() => unknown) = presentCheck(executable, "Executable must be present.");
    let thrown: AssertionError = Tools.assertThrows(AssertionError, validExecutable, "Expected AssertionError to be thrown.");
    Tools.assertObject(thrown, "Thrown must be an object.");
    Tools.assertNotNull(thrown.message, "Message must be present.");
  }

  /**
   * Assert that an object complies with basic expectations
   *
   * @param instance the object to check
   */
  public static assertObject(instance: unknown, message?: string) : void {
    Tools.assertNotNull(instance, message ?? "Object must be present.");

    if (typeof instance === 'object') {
      let object: object = instance as object;
      Tools.assertNotNull(object.toString(), "Object toString() was null.");
    }
    notStrictEqual(String(instance), 'undefined', message ?? "Object must be defined."); 
  }

  /**
   * Asserts that a class can NOT be instantiated
   *
   * @param theClass the class to check
   */
  public static assertInstantiateThrows(type: (new () => unknown)) : void {
    Tools.assertThrows<Error>(Error, () => {
      new type();
    });
  }

  /**
   * Assert the exception matches the exact specifications
   *
   * @param thrown the thrown exception
   * @param _cause the cause of the thrown exception
   * @param reason the reason (message) of the exception
   */
  public static assertExpectedError(thrown: Error, _cause: Error | null, reason: string): void {
    Tools.assertObject(thrown);

    Tools.assertAll(
      () => Tools.assertMessage(thrown.message),
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
          } catch (_) {
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
      // place holder for future cleaning logic
    });
  }

  /**
   * Do nothing for a period of time (Non-busy-wait)
   *
   * @param duration how long to sleep
   */
  public static async asyncsleep(duration: Duration) : Promise<void> {
    const sleep = (ms: number) : Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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
    const validConsumerBlock: (c: Contracts) => void = presentCheck(consumerBlock, "Block must be present.");
    const contracts: RequiredType<Contracts> = createContracts(validConfig);
    using _usingContracts: AutoClose = contracts.open();

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
    const validClose: AutoClose = presentCheck(autoClose, "AutoClose must be present.");
    validClose.close();
  }

  /**
   * Assert close can be called more than once without producing an exception
   *
   * @param autoClose the AutoClose to close
   * @throws IllegalArgumentException when arguments are null
   */
  public static assertIdempotent(autoClose: AutoClose): void {
    const validClose: AutoClose = presentCheck(autoClose, "AutoClose must be present.");
    for (let n = 0; n < 7; n++) {
      doesNotThrow(() => Tools.implicitClose(validClose), "AutoClose should be idempotent.");
      Tools.assertObject(autoClose); // should not become a landmine
    }
  }

  /**
   * Used to avoid warnings about unused variables in tests. try-with-resource unused, which is NOT a good warning.
   *
   * @param ignored not used
   */
  public static ignore(_ignored: unknown): void {
  }

  public static createStringContract(): Contract<string> {
    return createContract<string>({
      test: (value: unknown): value is string => {
        return value === null || value === undefined || typeof value === 'string';
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