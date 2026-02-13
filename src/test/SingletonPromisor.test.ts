import { strictEqual, throws } from "node:assert";
import { describe, it } from "node:test";

import { createContract } from "@jonloucks/contracts-ts";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { fromType, Promisor } from "@jonloucks/contracts-ts/api/Promisor";
import { PromisorFactory, CONTRACT as PROMISORS_CONTRACT } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { OptionalType } from "@jonloucks/contracts-ts/api/Types";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test";

generateSingletonSuite<Date>({
  name: 'Singleton Promisor with current Date',
  validCases: [
    { value: (): Date | null | undefined => { return undefined; }, help: "an undefined Date" },
    { value: (): Date | null | undefined => { return null; }, help: "a null Date" },
    { value: (): Date | null | undefined => { return new Date(); }, help: "a current date" }
  ],
});

let counter = 0;

generateSingletonSuite<number>({
  name: 'Singleton Promisor with number counter',
  validCases: [
    { value: (): number | null | undefined => { return undefined; }, help: "an undefined number" },
    { value: (): number | null | undefined => { return null; }, help: "a null number" },
    { value: (): number | null | undefined => { return ++counter; }, help: "a current number" }
  ],
});

interface Person {
  name: string;
  age: number;
}

generateSingletonSuite<Person>({
  name: 'Singleton Promisor with interface instance values',
  validCases: [
    { value: (): Person | null | undefined => { return { name: "Alice", age: 30 } }, help: "a Person object" }
  ],
  invalidCases: [
  ]
});

interface TestCase<T> {
  value: () => OptionalType<T>;
  help?: string;
}

interface InvalidTestCase<T> {
  value: () => OptionalType<T>;
  errorType?: string;
  errorMessage?: string;
  help?: string;
}

interface TestSuiteOptions<T> {
  name: string;
  validCases?: TestCase<T>[];
  invalidCases?: InvalidTestCase<T>[];
}

export function generateSingletonSuite<T>(options: TestSuiteOptions<T>): void {
  const { validCases, invalidCases } = options;

  describe(options.name + " valid cases", () => {
    validCases?.forEach((testCase, index) => {
      it(`case ${index}: when value is ${testCase?.help ?? testCase.value}`, () => {
        Tools.withContracts((contracts: Contracts) => {
          const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
          const contract: Contract<T> = createContract<T>({ guarded: false });
          const valuePromisor: Promisor<T> = fromType<T>(testCase.value);
          const promisor: Promisor<T> = promisorFactory.createSingleton<T>(valuePromisor)

          using usingPromisor = contracts.bind(contract, promisor);
          used(usingPromisor);

          const firstClaim: OptionalType<T> = contracts.claim(contract);
          const secondClaim: OptionalType<T> = contracts.claim(contract);
          strictEqual(firstClaim, secondClaim, "both claims should be the same instance.");
        });
      });
    });
  });

  describe(options.name + " invalid cases", () => {
    invalidCases?.forEach((testCase, index) => {
      it(`case ${index}: when value is ${testCase?.help ?? testCase.value}`, () => {
        Tools.withContracts((contracts: Contracts) => {
          const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
          throws(() => {
            promisorFactory.createSingleton<T>(null as unknown as Promisor<T>);
          }, {
            name: testCase.errorType,
            message: testCase.errorMessage
          });
        });
      });
    });
  });
}

