import assert from "node:assert";

import { Contracts } from "contracts-ts/api/Contracts";
import { AtomicBoolean, LAWYER } from "contracts-ts/api/AtomicBoolean";
import { CONTRACT as FACTORY, LAWYER as FACTORY_LAWYER } from "contracts-ts/api/AtomicBooleanFactory";
import { Tools } from "contracts-ts/test/Test.tools.test";
import { generateTestsForLawyer } from "contracts-ts/test/Lawyer.tools.test";

describe('AtomicBoolean', () => {

  it('LAWYER.isDeliverable', () => {
    assert.strictEqual(LAWYER.isDeliverable(null), true);
    assert.strictEqual(LAWYER.isDeliverable(undefined), true);
    assert.strictEqual(LAWYER.isDeliverable({}), false);
    assert.strictEqual(LAWYER.isDeliverable({
      get: () => 0,
      set: (_value: boolean) => { },
      compareAndSet: (_expectedValue: boolean, _newValue: boolean) => true,
    }), true);
    assert.strictEqual(LAWYER.isDeliverable({
      get: () => 0,
      // set: (value: boolean) => { },
    }), false);
  });

  it('AtomicBoolean FACTORY works', () => {
    Tools.withContracts((contracts: Contracts) => {
      assert.strictEqual(contracts.isBound(FACTORY), true);
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create();
      assert.notStrictEqual(atomic, null);
    });
  });

  it('AtomicBoolean with defaults', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create();

      assert.strictEqual(atomic.get(), false);
      assert.strictEqual(atomic.toString(), "false");
    });
  });

  it('AtomicBoolean with true initial value', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create(true);

      assert.strictEqual(atomic.get(), true);
      assert.strictEqual(atomic.toString(), "true");
    });
  });

  it('AtomicBoolean Symbol.toPrimitive', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create(true);

      const primitiveString = atomic[Symbol.toPrimitive]('string');
      const primitiveNumber = atomic[Symbol.toPrimitive]('number');
      const primitiveBoolean = atomic[Symbol.toPrimitive]('boolean');
      const primitiveDefault = atomic[Symbol.toPrimitive]('default');

      assert.strictEqual(primitiveString, "true");
      assert.strictEqual(primitiveNumber, 1);
      assert.strictEqual(primitiveBoolean, true);
      assert.strictEqual(primitiveDefault, true);
    });
  });

  it('AtomicBoolean with false initial value', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create(false);

      assert.strictEqual(atomic.get(), false);
      assert.strictEqual(atomic.toString(), "false");
    });
  });

  it('AtomicBoolean methods work', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create();

      assert.strictEqual(atomic.get(), false);
      assert.strictEqual(atomic.toString(), "false");

      atomic.set(true);
      assert.strictEqual(atomic.get(), true);

      const updated = atomic.compareAndSet(true, false);
      assert.strictEqual(updated, true);
      assert.strictEqual(atomic.get(), false);
    });
  });

  it('FACTORY_LAWYER.isDeliverable', () => {
    Tools.withContracts((contracts: Contracts) => {
      assert.strictEqual(FACTORY_LAWYER.isDeliverable(() => { return {}; }), false, "with function is false");

      let duck = { create: () => { return {}; } };
      assert.strictEqual(FACTORY_LAWYER.isDeliverable(duck), true, "with duck-type is true");

      assert.strictEqual(FACTORY_LAWYER.isDeliverable("abc"), false, 'with string is false');
      assert.strictEqual(FACTORY_LAWYER.isDeliverable(123), false, 'with number is false');
      assert.strictEqual(FACTORY_LAWYER.isDeliverable({}), false, 'with empty object is false');
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create();
      assert.strictEqual(FACTORY_LAWYER.isDeliverable(atomic), false, 'with AtomicBoolean is false');
    });
  });

});

generateCompareAndSet({
  validCases: [
    // when current state is false
    { current: false, required: false, requested: true, updated: true, final: true },
    { current: false, required: false, requested: false, updated: true, final: false },
    { current: false, required: true, requested: true, updated: false, final: false },
    { current: false, required: true, requested: false, updated: false, final: false },
    // when current state is true
    { current: true, required: true, requested: false, updated: true, final: false },
    { current: true, required: true, requested: true, updated: true, final: true },
    { current: true, required: false, requested: true, updated: false, final: true },
    { current: true, required: false, requested: false, updated: false, final: true },
  ]
});

generateTestsForLawyer(LAWYER);

interface CompareAndSetCase {
  current: boolean
  required: boolean;
  requested: boolean;
  final: boolean;
  updated: boolean;
  help?: string;
}

interface CompareAndSetSuiteOptions {
  validCases?: CompareAndSetCase[];
}

export function generateCompareAndSet(options: CompareAndSetSuiteOptions) {
  const { validCases } = options;

  describe(`CompareAndSet Suite for AtomicBoolean`, () => {

    validCases?.forEach((testCase, _index) => {
      it(`when currently ${testCase.current} compareAndSet( ${testCase.required} , ${testCase.requested} ) => ${testCase.updated} with final state ${testCase.final}`, () => {
        Tools.withContracts((contracts: Contracts) => {
          const atomic: AtomicBoolean = contracts.enforce(FACTORY).create(testCase.current);

          const actual = atomic.compareAndSet(testCase.required, testCase.requested);
          assert.strictEqual(actual, testCase.updated);
          assert.strictEqual(atomic.get(), testCase.final);
        });
      });
    });
  });
}

