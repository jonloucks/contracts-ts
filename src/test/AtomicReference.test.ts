import { strictEqual, notStrictEqual } from "node:assert";

import { AtomicReference, LAWYER } from "contracts-ts/api/auxiliary/AtomicReference";
import { CONTRACT as FACTORY, LAWYER as FACTORY_LAWYER } from "contracts-ts/api/auxiliary/AtomicReferenceFactory";
import { OptionalType } from "contracts-ts/api/auxiliary/Types";
import { Contracts } from "contracts-ts/api/Contracts";
import { generateTestsForLawyer } from "contracts-ts/test/Lawyer.tools.test";
import { Tools } from "contracts-ts/test/Test.tools.test";

describe('AtomicReference', () => {
  it('LAWYER.isDeliverable', () => {
    const lawyer = LAWYER;
    strictEqual(lawyer.isDeliverable(null), true, "null is deliverable");
    strictEqual(lawyer.isDeliverable(undefined), true, "undefined is deliverable");
    strictEqual(lawyer.isDeliverable({}), false, "empty object is not deliverable");
    strictEqual(lawyer.isDeliverable({
      get: () => 0,
      set: (_value: Date) => { },
      compareAndSet: (_expectedValue: Date, _newValue: Date) => true,
    }), true, "object with get, set, and compareAndSet is deliverable");
    strictEqual(lawyer.isDeliverable({
      get: () => 0,
      // set: (value: boolean) => { },
    }), false, "object missing set is not deliverable");
  });

  it('AtomicReference FACTORY works', () => {
    Tools.withContracts((contracts: Contracts) => {
      strictEqual(contracts.isBound(FACTORY), true, "FACTORY is bound");
      const atomic: AtomicReference<Date> = contracts.enforce(FACTORY).create();
      notStrictEqual(atomic, null, "created AtomicReference is not null");
    });
  });

  it('AtomicReference with defaults', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicReference<Date> = contracts.enforce(FACTORY).create();
      strictEqual(atomic.get(), undefined, "default initial value is undefined");
    });
  });

  it('AtomicReference with true initial value', () => {
    Tools.withContracts((contracts: Contracts) => {
      const now: Date = new Date();
      const atomic: AtomicReference<Date> = contracts.enforce(FACTORY).create(now);

      strictEqual(atomic.get(), now, "initial value should be the provided date");
    });
  });

  it('AtomicReference methods work', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicReference<number> = contracts.enforce(FACTORY).create();

      strictEqual(atomic.get(), undefined, "initial value should be undefined");

      notStrictEqual(atomic.toString(), null, "toString with undefined should not be null");
      notStrictEqual(atomic.toString(), undefined, "toString with undefined should not be undefined");

      atomic.set(12);
      strictEqual(atomic.get(), 12, "after set to 12, get should be 12");

      const updated = atomic.compareAndSet(12, 24);
      strictEqual(updated, true);
      strictEqual(atomic.get(), 24, "after compareAndSet to 24, get should be 24");

      atomic.set(null);
      strictEqual(atomic.get(), null, "set to null should be get as null");

      atomic.set(undefined);
      strictEqual(atomic.get(), undefined, "set to undefined should be get as undefined");

      notStrictEqual(atomic.toString(), null, "toString with undefined should not be null");
      notStrictEqual(atomic.toString(), undefined, "toString with undefined should not be undefined");
    });
  });

  it('FACTORY_LAWYER.isDeliverable', () => {
    Tools.withContracts((contracts: Contracts) => {
      strictEqual(FACTORY_LAWYER.isDeliverable(() : unknown => { return {}; }), false, "with function is false");
      let duck = { create: () : unknown => { return {}; } };
      strictEqual(FACTORY_LAWYER.isDeliverable(duck), true, "with duck-type is true");
      strictEqual(FACTORY_LAWYER.isDeliverable("abc"), false, 'with string is false');
      strictEqual(FACTORY_LAWYER.isDeliverable(123), false, 'with number is false');
      strictEqual(FACTORY_LAWYER.isDeliverable({}), false, 'with empty object is false');
      const atomic: AtomicReference<Date> = contracts.enforce(FACTORY).create();
      strictEqual(FACTORY_LAWYER.isDeliverable(atomic), false, 'with AtomicReference is false');
    });
  });
});

generateCompareAndSet<string>({
  validCases: [
    { current: undefined, required: undefined, requested: "red", updated: true, final: "red" },
    { current: undefined, required: "blue", requested: "red", updated: false, final: undefined },
    { current: undefined, required: null, requested: "red", updated: false, final: undefined },
    { current: null, required: null, requested: "red", updated: true, final: "red" },
    { current: null, required: "blue", requested: "red", updated: false, final: null },
    { current: null, required: undefined, requested: "red", updated: false, final: null },
    { current: "green", required: "green", requested: "red", updated: true, final: "red" },
    { current: "green", required: "blue", requested: "red", updated: false, final: "green" },
    { current: "green", required: undefined, requested: "blue", updated: false, final: "green" },
    { current: "green", required: null, requested: "blue", updated: false, final: "green" },
  ]
});

generateTestsForLawyer(LAWYER);

interface CompareAndSetCase<T> {
  current: OptionalType<T>;
  required: OptionalType<T>;
  requested: OptionalType<T>;
  final: OptionalType<T>;
  updated: boolean;
  help?: string;
}

interface CompareAndSetSuiteOptions<T> {
  validCases?: CompareAndSetCase<T>[];
}

export function generateCompareAndSet<T>(options: CompareAndSetSuiteOptions<T>) : void {
  const { validCases } = options;

  describe(`CompareAndSet Suite for AtomicReference`, () => {
    validCases?.forEach((testCase, index) => {
      it(`case ${index}: when ${testCase.current}, compareAndSet( ${testCase.required} , ${testCase.requested} ) => ${testCase.updated}, is ${testCase.final}`, () => {
        Tools.withContracts((contracts: Contracts) => {
          const atomic: AtomicReference<T> = contracts.enforce(FACTORY).create(testCase.current);

          const wasUpdated = atomic.compareAndSet(testCase.required, testCase.requested);
          strictEqual(wasUpdated, testCase.updated, testCase.updated ? `Expected update` : `Expected no update`);
          strictEqual(atomic.get(), testCase.final, `Expected final value to be ${testCase.final}`);
        });
      });
    });
  });
}
