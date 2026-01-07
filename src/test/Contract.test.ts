import assert from 'node:assert';

import { Contract } from "../api/Contract";

import { Tools } from "./Test.tools.test";
import { generateContractSuite } from "./Contract.tools.test";
import { isString } from "../api/Types";
import { ClassCastException } from "../api/ClassCastException";

describe('Create string contract', () => {
  const contract: Contract<string> = Contract.create<string>({
    name: "Test String Contract",
    test: isString,
    typeName: "string",
    isReplaceable: false
  });

  it('should have correct properties', () => {
    assert.strictEqual(contract.getName(), "Test String Contract");
    assert.strictEqual(contract.getTypeName(), "string");
    assert.strictEqual(contract.isReplaceable(), false);
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

describe('Prohibit duck typing or extending Contract class', () => {
  assert.throws(() => {
    const instance: Contract<string> = new (Contract<string> as any)["constructor"]();
    Object.setPrototypeOf(instance, Contract.prototype);
    Contract.isContract(instance);
  }, {
    name: 'ContractException',
    message: "Security violation detected. This is not permitted."
  });
});

test('contract_Config_Defaults', () => {
  const defaults: Contract<string> = Contract.create<string>({ test: isString });
  Tools.assertAll(
    () => Tools.assertFalse(defaults.isReplaceable(), "Default for replaceable."),
    () => Tools.assertEquals("", defaults.getName(), "Default for name."),
    () => Tools.assertEquals("", defaults.getTypeName(), "Default for typeName."),
    () => Tools.assertSame("abc", defaults.cast("abc"), "Cast should work."),
    () => Tools.assertThrows(ClassCastException, () => defaults.cast(12), "Cast should fail on wrong type")
  );
});

test('contract_create_withNullConfig_Works', () => {
  const contract: Contract<string> = Contract.create<string>(null);

  assert.ok(contract);
});

// test('contract_create_withNullClass_Throws()', () => {
  //     assertThrown(IllegalArgumentException, () => Contract.create((Class<?>)null));
// });

// test('contract_create_withNullClassAndBuilder_Throws', () => {
  //     Consumer<Contract.Config.Builder<String>> builderConsumer = b => {};
  //     assertThrown(IllegalArgumentException, () => Contract.create(null, builderConsumer));
// });

// test('contract_create_withClassAndNullBuilder_Throws', () => {
  //     assertThrown(IllegalArgumentException, () => Contract.create(String, null));
// });


// test('contract_create_withClassAndBuilder_Works', () => {
//     Contract<String> contract = Contract.create(String,
//         b => {
//             assertSame(b, b.name("test"));
//             assertSame(b, b.replaceable(true));
//             assertSame(b, b.typeName("chars"));
//         });

//     assertObject(contract);
//     assertEquals("test", contract.getName());
//     assertEquals("chars", contract.getTypeName());
//     assertTrue(contract.isReplaceable(), "Contract should have been replaceable");
// });

// no auto type detection in TypeScript
// test('contract_create_IntegerContract_Works', () => {
//     const contractName : string= "testContract";
//     const contract : Contract<number> = Contract.create<string>(contractName);
//     const expectedConfig : Config<number> =  {
// 
//         name : contractName,
//         typeName : "number",
//         cast : (instance: any): number => {
//             return instance as number;
//         }
//     };
//     assertContract(contract, expectedConfig, 0);
// });

// no auto type detection in TypeScript
// default void contract_create_IntegerContract_Works() {
//     String contractName = "testContract";
//     Contract<Integer> contract = Contract.create(contractName);
//     Contract.Config<Integer> expectedConfig = new Contract.Config<>() {
// 
//         @Override
//         public String name() {
//             return contractName;
//         }
// 
//         @Override
//         public String typeName() {
//             return Integer.getTypeName();
//         }
// 
//         @Override
//         public Integer cast(Object instance) {
//             return (Integer) instance;
//         }
// 
//     };
//     assertContract(contract, expectedConfig, 0);
// }

// no auto type detection in TypeScript
// test('contract_create_Works', () => {
//   const config: Config<string> = {
//     cast: (instance: any): string => {
//       return instance as string;
//     },
//     typeName: "string",
//     name: "Some String contract"
//   };
// 
//   const contract: Contract<string> = Contract.create<string>();
// 
//   Tools.assertContract(contract, config, "abc");
// });



