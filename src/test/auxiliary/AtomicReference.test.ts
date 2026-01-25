import { notStrictEqual, strictEqual } from "node:assert";

import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { OptionalType } from "@jonloucks/contracts-ts/api/Types";
import { AtomicReference, guard } from "@jonloucks/contracts-ts/auxiliary/AtomicReference";
import { CONTRACT as FACTORY } from "@jonloucks/contracts-ts/auxiliary/AtomicReferenceFactory";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test";
import { assertGuard } from "../helper.test";

describe('AtomicReference', () => {
  it('AtomicReference FACTORY works', () => {
    Tools.withContracts((contracts: Contracts) => {
      strictEqual(contracts.isBound(FACTORY), true, "FACTORY is bound");
      const atomic: AtomicReference<Date> = contracts.enforce(FACTORY).createAtomicReference();
      notStrictEqual(atomic, null, "created AtomicReference is not null");
    });
  });

  it('AtomicReference with defaults', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicReference<Date> = contracts.enforce(FACTORY).createAtomicReference();
      strictEqual(atomic.get(), undefined, "default initial value is undefined");
    });
  });

  it('AtomicReference with true initial value', () => {
    Tools.withContracts((contracts: Contracts) => {
      const now: Date = new Date();
      const atomic: AtomicReference<Date> = contracts.enforce(FACTORY).createAtomicReference(now);

      strictEqual(atomic.get(), now, "initial value should be the provided date");
    });
  });

  it('AtomicReference methods work', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicReference<number> = contracts.enforce(FACTORY).createAtomicReference();

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
      const previousValue = atomic.getAndSet(42);
      strictEqual(previousValue, undefined, "getAndSet previous value is undefined");
      strictEqual(atomic.get(), 42, "value after getAndSet to 42 is 42");
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

generateGetAndSet<string>({
  validCases: [
    { current: undefined, requested: "alpha", help: "from undefined to 'alpha'" },
    { current: null, requested: "beta", help: "from null to 'beta'" },
    { current: "gamma", requested: "delta", help: "from 'gamma' to 'delta'" },
    { current: undefined, requested: undefined, help: "from undefined to undefined" },
    { current: null, requested: undefined, help: "from null to undefined" },
    { current: null, requested: null, help: "from null to null" },
    { current: "epsilon", requested: null, help: "from 'epsilon' to null" },
    { current: "epsilon", requested: undefined, help: "from 'epsilon' to undefined" },
  ]
});

assertGuard(guard, "compareAndSet", "get", "set", "getAndSet");

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
          const atomic: AtomicReference<T> = contracts.enforce(FACTORY).createAtomicReference(testCase.current);

          const wasUpdated = atomic.compareAndSet(testCase.required, testCase.requested);
          strictEqual(wasUpdated, testCase.updated, testCase.updated ? `Expected update` : `Expected no update`);
          strictEqual(atomic.get(), testCase.final, `Expected final value to be ${testCase.final}`);
        });
      });
    });
  });
}

interface GetAndSetCase<T> {
  current: OptionalType<T>;
  requested: OptionalType<T>;
  help?: string;
}

interface GetAndSetSuiteOptions<T> {
  validCases?: GetAndSetCase<T>[];
}

export function generateGetAndSet<T>(options: GetAndSetSuiteOptions<T>) : void {
  const { validCases } = options;

  describe(`GetAndSet Suite for AtomicReference`, () => {
    validCases?.forEach((testCase, index) => {
      it(`case ${index}: when ${testCase.current}, getAndSet( ${testCase.requested} ) => ${testCase.current}, is ${testCase.requested}`, () => {
        Tools.withContracts((contracts: Contracts) => {
          const atomic: AtomicReference<T> = contracts.enforce(FACTORY).createAtomicReference(testCase.current);

          const previousValue = atomic.getAndSet(testCase.requested);
          strictEqual(previousValue, testCase.current, `Expected previous value to be ${testCase.current}`);
          strictEqual(atomic.get(), testCase.requested, `Expected final value to be ${testCase.requested  }`);
        });
      });
    });
  });
}