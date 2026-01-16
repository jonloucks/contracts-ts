import { strictEqual, notStrictEqual } from "node:assert";

import { AtomicBoolean, LAWYER } from "contracts-ts/api/auxiliary/AtomicBoolean";
import { CONTRACT as FACTORY, LAWYER as FACTORY_LAWYER } from "contracts-ts/api/auxiliary/AtomicBooleanFactory";
import { Contracts } from "contracts-ts/api/Contracts";
import { generateTestsForLawyer } from "contracts-ts/test/Lawyer.tools.test";
import { Tools } from "contracts-ts/test/Test.tools.test";

describe('AtomicBoolean', () => {

  it('LAWYER.isDeliverable', () => {
    const lawyer = LAWYER;
    strictEqual(lawyer.isDeliverable(null), true, "null is deliverable");
    strictEqual(lawyer.isDeliverable(undefined), true, "undefined is deliverable");
    strictEqual(lawyer.isDeliverable({}), false, "empty object is not deliverable");
    strictEqual(lawyer.isDeliverable({
      get: () => 0,
      set: (_value: boolean) => { },
      compareAndSet: (_expectedValue: boolean, _newValue: boolean) => true,
    }), true, "object with get, set, and compareAndSet is deliverable");
    strictEqual(lawyer.isDeliverable({
      get: () => 0,
      // set: (value: boolean) => { },
    }), false, "missing set is not deliverable");
  });

  it('AtomicBoolean FACTORY works', () => {
    Tools.withContracts((contracts: Contracts) => {
      strictEqual(contracts.isBound(FACTORY), true, "FACTORY is bound");
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create();
      notStrictEqual(atomic, null, "created AtomicBoolean is not null");
    });
  });

  it('AtomicBoolean with defaults', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create();

      strictEqual(atomic.get(), false, "default initial value is false");
      strictEqual(atomic.toString(), "false", "toString of default false is 'false'");
    });
  });

  it('AtomicBoolean with true initial value', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create(true);

      strictEqual(atomic.get(), true, "initial value is true");
      strictEqual(atomic.toString(), "true", "toString of true is 'true'");
    });
  });

  it('AtomicBoolean Symbol.toPrimitive', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create(true);

      strictEqual(atomic[Symbol.toPrimitive]('string'), "true", "toPrimitive with 'string' hint returns 'true'");
      strictEqual(atomic[Symbol.toPrimitive]('number'), 1, "toPrimitive with 'number' hint returns 1");
      strictEqual(atomic[Symbol.toPrimitive]('boolean'), true, "toPrimitive with 'boolean' hint returns true");
      strictEqual(atomic[Symbol.toPrimitive]('default'), true, "toPrimitive with 'default' hint returns true");
    });
  });

  it('AtomicBoolean with false initial value', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create(false);

      strictEqual(atomic.get(), false, "initial value is false");
      strictEqual(atomic.toString(), "false", "toString of false is 'false'");
    });
  });

  it('AtomicBoolean methods work', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create();

      strictEqual(atomic.get(), false, "default initial value is false");
      strictEqual(atomic.toString(), "false", "toString of default false is 'false'");

      atomic.set(true);
      strictEqual(atomic.get(), true, "value after set to true is true");

      const updated = atomic.compareAndSet(true, false);
      strictEqual(updated, true, "compareAndSet from true to false returns true");
      strictEqual(atomic.get(), false, "value after compareAndSet to false is false");
    });
  });

  it('FACTORY_LAWYER.isDeliverable', () => {
    const factoryLawyer = FACTORY_LAWYER;
    Tools.withContracts((contracts: Contracts) => {
      strictEqual(factoryLawyer.isDeliverable(() => { return {}; }), false, "with function is false");

      let duck = { create: () => { return {}; } };
      strictEqual(factoryLawyer.isDeliverable(duck), true, "with duck-type is true");

      strictEqual(factoryLawyer.isDeliverable("abc"), false, 'with string is false');
      strictEqual(factoryLawyer.isDeliverable(123), false, 'with number is false');
      strictEqual(factoryLawyer.isDeliverable({}), false, 'with empty object is false');
      const atomic: AtomicBoolean = contracts.enforce(FACTORY).create();
      strictEqual(factoryLawyer.isDeliverable(atomic), false, 'with AtomicBoolean is false');
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

    validCases?.forEach((testCase, index) => {
      it(`case #${index} when currently ${testCase.current} compareAndSet( ${testCase.required} , ${testCase.requested} ) => ${testCase.updated} with final state ${testCase.final}`, () => {
        Tools.withContracts((contracts: Contracts) => {
          const atomic: AtomicBoolean = contracts.enforce(FACTORY).create(testCase.current);

          const actual = atomic.compareAndSet(testCase.required, testCase.requested);
          strictEqual(actual, testCase.updated);
          strictEqual(atomic.get(), testCase.final);
        });
      });
    });
  });
}

