import { notStrictEqual, strictEqual } from "node:assert";

import { AtomicInteger, LAWYER } from "@io.github.jonloucks/contracts-ts/api/auxiliary/AtomicInteger";
import { CONTRACT as FACTORY, LAWYER as FACTORY_LAWYER } from "@io.github.jonloucks/contracts-ts/api/auxiliary/AtomicIntegerFactory";
import { Contracts } from "@io.github.jonloucks/contracts-ts/api/Contracts";
import { generateTestsForLawyer } from "@io.github.jonloucks/contracts-ts/test/Lawyer.tools.test";
import { Tools } from "@io.github.jonloucks/contracts-ts/test/Test.tools.test";

describe('AtomicInteger', () => {

  it('LAWYER.isDeliverable', () => {
    const lawyer = LAWYER;
    strictEqual(lawyer.isDeliverable(null), true, "null is deliverable");
    strictEqual(lawyer.isDeliverable(undefined), true, "undefined is deliverable");
    strictEqual(lawyer.isDeliverable({}), false, "empty object is not deliverable");
    strictEqual(lawyer.isDeliverable({
      get: () => 0,
      set: (_value: number) => { },
      compareAndSet: (_expectedValue: number, _newValue: number) => true,
      incrementAndGet: () => 1,
      decrementAndGet: () => -1
    }), true, "object with get, set, compareAndSet, incrementAndGet, and decrementAndGet is deliverable");
    strictEqual(lawyer.isDeliverable({
      get: () => 0,
      set: (_value: number) => { },
      // compareAndSet: (expectedValue: number, newValue: number) => true,
      incrementAndGet: () => 1,
      decrementAndGet: () => -1
    }), false, "object missing compareAndSet is not deliverable");
  });

  it('AtomicInteger FACTORY works', () => {
    Tools.withContracts((contracts: Contracts) => {
      strictEqual(contracts.isBound(FACTORY), true, "FACTORY is bound");
      const atomic: AtomicInteger = contracts.enforce(FACTORY).create();
      notStrictEqual(atomic, null, "created AtomicInteger is not null");
    });
  });

  it('AtomicInteger methods work', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicInteger = contracts.enforce(FACTORY).create();
      strictEqual(atomic.get(), 0, "default initial value is 0");
      strictEqual(atomic.toString(), "0", "toString of default 0 is '0'");
      atomic.set(5);
      strictEqual(atomic.get(), 5, "value after set to 5 is 5");
      const updated = atomic.compareAndSet(5, 10);
      strictEqual(updated, true, "compareAndSet from 5 to 10 returns true");
      strictEqual(atomic.get(), 10, "value after compareAndSet to 10 is 10");
      const notUpdated = atomic.compareAndSet(5, 15);
      strictEqual(notUpdated, false, "compareAndSet from 5 to 15 returns false");
      strictEqual(atomic.get(), 10, "value after failed compareAndSet remains 10");
      const incremented = atomic.incrementAndGet();
      strictEqual(incremented, 11, "value after incrementAndGet is 11");
      const decremented = atomic.decrementAndGet();
      strictEqual(decremented, 10, "value after decrementAndGet is 10");
      strictEqual(atomic.toString(), "10", "toString after decrementAndGet is '10'");
    });
  });

  it('AtomicInteger Symbol.toPrimitive', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicInteger = contracts.enforce(FACTORY).create(3);

      strictEqual(atomic[Symbol.toPrimitive]('string'), "3", "toPrimitive with 'string' hint returns '3'");
      strictEqual(atomic[Symbol.toPrimitive]('number'), 3, "toPrimitive with 'number' hint returns 3");
      strictEqual(atomic[Symbol.toPrimitive]('boolean'), true, "toPrimitive with 'boolean' hint returns true");
      strictEqual(atomic[Symbol.toPrimitive]('default'), 3, "toPrimitive with 'default' hint returns 3");
    });
  });

  it('FACTORY_LAWYER.isDeliverable', () => {
    Tools.withContracts((contracts: Contracts) => {
      const factoryLawyer = FACTORY_LAWYER;
      strictEqual(factoryLawyer.isDeliverable(null), true, "with null is true");
      strictEqual(factoryLawyer.isDeliverable(undefined), true, "with undefined is true");
      strictEqual(factoryLawyer.isDeliverable((): unknown => { return {}; }), false, "with function is false");

      let duck = { create: () : unknown=> { return {}; } };
      strictEqual(factoryLawyer.isDeliverable(duck), true, "with duck-type is true");
      strictEqual(factoryLawyer.isDeliverable("abc"), false, "with string is false");
      strictEqual(factoryLawyer.isDeliverable(123), false, "with number is false");
      strictEqual(factoryLawyer.isDeliverable({}), false, "with empty object is false");

      const atomic: AtomicInteger = contracts.enforce(FACTORY).create();
      strictEqual(factoryLawyer.isDeliverable(atomic), false, 'with AtomicInteger is false');
    });
  });
});
generateTestsForLawyer(LAWYER);


