import { strictEqual, ok } from "node:assert";

import { createContract } from "contracts-ts";
import { ClassCastException } from "contracts-ts/api/auxiliary/ClassCastException";
import { isString } from "contracts-ts/api/auxiliary/Types";
import { Contract } from "contracts-ts/api/Contract";
import { generateContractSuite } from "contracts-ts/test/Contract.tools.test";
import { Tools } from "contracts-ts/test/Test.tools.test";

describe('Create string contract', () => {
  const contract: Contract<string> = createContract<string>({
    name: "Test String Contract",
    test: isString,
    typeName: "string",
    replaceable: false
  });

  it('should have correct properties', () => {
    strictEqual(contract.name, "Test String Contract", "Contract name should be 'Test String Contract'");
    strictEqual(contract.typeName, "string", "Contract typeName should be 'string'");
    strictEqual(contract.replaceable, false, "Contract replaceable should be false");
  });

  generateContractSuite({
    name: 'String Contract',
    contract: contract,
    invalidCases: [
      { instance: 123, help: 'number' },
      { instance: {}, help: 'object' },
      { instance: [], help: 'array' },
      { instance: true, help: 'boolean' }
    ],
    validCases: [
      { instance: null, help: 'null' },
      { instance: undefined, help: 'undefined' },
      { instance: "hello", expected: "hello", help: 'string' },
      { instance: "", expected: "", help: 'empty string' }
    ]
  });
});

test('contract_Config_Defaults', () => {
  const defaults: Contract<string> = createContract<string>({ test: isString });
  Tools.assertAll(
    () => Tools.assertFalse(defaults.replaceable, "Default for replaceable."),
    () => Tools.assertEquals("", defaults.name, "Default for name."),
    () => Tools.assertEquals("", defaults.typeName, "Default for typeName."),
    () => Tools.assertSame("abc", defaults.cast("abc"), "Cast should work."),
    () => Tools.assertThrows(ClassCastException, () => defaults.cast(12), "Cast should fail on wrong type")
  );
});

test('contract_create_withNullConfig_Works', () => {
  const contract: Contract<string> = createContract<string>(null);

  ok(contract);
});