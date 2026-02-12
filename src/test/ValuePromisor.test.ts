import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { createContract } from "@jonloucks/contracts-ts";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Promisor } from "@jonloucks/contracts-ts/api/Promisor";
import { CONTRACT as PROMISOR_FACTORY_CONTRACT, PromisorFactory } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { OptionalType } from "@jonloucks/contracts-ts/api/Types";
import { Tools } from "./Test.tools.test.js";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

generateValueSuite<string>({
  name: 'Value Promisor with primitive string values',
  validCases: [
    { value: "hello", help: "a simple string" },
    { value: "", help: "an empty string" },
    { value: " ", help: "a space string" },
  ],
});

generateValueSuite<boolean>({
  name: 'Value Promisor with primitive boolean values',
  validCases: [
    { value: true, help: "a true boolean" },
    { value: false, help: "a false boolean" },
  ],
});

generateValueSuite<number>({
  name: 'Value Promisor with primitive number values',
  validCases: [
    { value: 0, help: "a zero number" },
    { value: 42, help: "a positive number" }
  ],
});

generateValueSuite<Date>({
  name: 'Value Promisor with Date values',
  validCases: [
    { value: new Date(0), help: "a zero date" },
    { value: new Date(), help: "a current date" }
  ],
});

interface Person {
  name: string;
  age: number;
}

generateValueSuite<Person>({
  name: 'Value Promisor with interface instance values',
  validCases: [
    { value: { name: "Alice", age: 30 }, help: "a Person object" }
  ],
});

interface TestCase<T> {
  value: OptionalType<T>;
  help?: string;
}

interface TestSuiteOptions<T> {
  name: string;
  validCases?: TestCase<T>[];
}

function generateValueSuite<T>(options: TestSuiteOptions<T>) : void {
  const { validCases } = options;

  describe(options.name, () => {
    validCases?.forEach((testCase, index) => {
      it(`case ${index}: when value is ${testCase?.help ?? testCase.value}`, () => {
        Tools.withContracts((contracts: Contracts) => {
          const promisorFactory: PromisorFactory = contracts.enforce(PROMISOR_FACTORY_CONTRACT);
          const contract: Contract<T> = createContract<T>();
          const promisor: Promisor<T> = promisorFactory.createValue<T>(testCase.value)

          using usingPromisor = contracts.bind(contract, promisor);
          used(usingPromisor);

          const delivered: OptionalType<T> = contracts.claim(contract);
          strictEqual(delivered, testCase.value, "promisor demand should match the value.");
        });
      });
    });
  });
}

