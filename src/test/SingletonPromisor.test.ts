import assert from "node:assert";

import { Contract } from "contracts-ts/api/Contract";
import { Contracts } from "contracts-ts/api/Contracts";
import { typeToPromisor, Promisor } from "contracts-ts/api/Promisor";
import { PromisorFactory, CONTRACT as PROMISORS_CONTRACT } from "contracts-ts/api/PromisorFactory";
import { OptionalType } from "contracts-ts/api/Types";
import { Tools } from "contracts-ts/test/Test.tools.test";
import { createContract } from "contracts-ts";

generateSingletonSuite<Date>({
  name: 'Singleton Promisor with current Date',
  validCases: [
    { value: () => { return undefined; }, help: "an undefined Date" },
    { value: () => { return null; }, help: "a null Date" },
    { value: () => { return new Date(); }, help: "a current date" }
  ],
});

let counter = 0;

generateSingletonSuite<number>({
  name: 'Singleton Promisor with number counter',
  validCases: [
    { value: () => { return undefined; }, help: "an undefined number" },
    { value: () => { return null; }, help: "a null number" },
    { value: () => { return ++counter; }, help: "a current number" }
  ],
});

interface Person {
  name: string;
  age: number;
}

generateSingletonSuite<Person>({
  name: 'Singleton Promisor with interface instance values',
  validCases: [
    { value: () => { return undefined; }, help: "an undefined Person" },
    { value: () => { return null; }, help: "a null Person" },
    { value: () => { return { name: "Alice", age: 30 } }, help: "a Person object" }
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

export function generateSingletonSuite<T>(options: TestSuiteOptions<T>) {
  const { validCases, invalidCases } = options;

  describe(options.name + " valid cases", () => {
    validCases?.forEach((testCase, index) => {
      it(`case ${index}: when value is ${testCase?.help ?? testCase.value}`, () => {
        Tools.withContracts((contracts: Contracts) => {
          const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
          const contract: Contract<T> = createContract<T>();
          const valuePromisor: Promisor<T> = typeToPromisor<T>(testCase.value);
          const promisor: Promisor<T> = promisorFactory.createSingleton<T>(valuePromisor)

          using _usingPromisor = contracts.bind(contract, promisor);

          const firstClaim: OptionalType<T> = contracts.claim(contract);
          const secondClaim: OptionalType<T> = contracts.claim(contract);
          assert.strictEqual(firstClaim, secondClaim, "both claims should be the same instance.");
        });
      });
    });
  });

  describe(options.name + " invalid cases", () => {
    invalidCases?.forEach((testCase, index) => {
      it(`case ${index}: when value is ${testCase?.help ?? testCase.value}`, () => {
        Tools.withContracts((contracts: Contracts) => {
          const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
          assert.throws(() => {
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

