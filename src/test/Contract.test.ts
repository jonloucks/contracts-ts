import assert from 'node:assert';

import { Contract } from "../api/Contract";
import { Tools } from "./Test.tools.test";
import { generateContractSuite } from "./Contract.tools.test";
import { isString } from "../api/Types";
import { ClassCastException } from "../api/ClassCastException";
import { createContract } from "../index";

describe('Create string contract', () => {
  const contract: Contract<string> = createContract<string>({
    name: "Test String Contract",
    test: isString,
    typeName: "string",
    replaceable: false
  });

  it('should have correct properties', () => {
    assert.strictEqual(contract.name, "Test String Contract");
    assert.strictEqual(contract.typeName, "string");
    assert.strictEqual(contract.replaceable, false);
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

  assert.ok(contract);
});