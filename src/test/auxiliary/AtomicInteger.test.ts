import { notStrictEqual, strictEqual } from "node:assert";

import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { AtomicInteger, guard } from "@jonloucks/contracts-ts/auxiliary/AtomicInteger";
import { CONTRACT as FACTORY } from "@jonloucks/contracts-ts/auxiliary/AtomicIntegerFactory";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test";
import { assertGuard } from "../helper.test";

describe('AtomicInteger', () => {
  it('AtomicInteger FACTORY works', () => {
    Tools.withContracts((contracts: Contracts) => {
      strictEqual(contracts.isBound(FACTORY), true, "FACTORY is bound");
      const atomic: AtomicInteger = contracts.enforce(FACTORY).createAtomicInteger();
      notStrictEqual(atomic, null, "created AtomicInteger is not null");
    });
  });

  it('AtomicInteger methods work', () => {
    Tools.withContracts((contracts: Contracts) => {
      const atomic: AtomicInteger = contracts.enforce(FACTORY).createAtomicInteger();
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
      const atomic: AtomicInteger = contracts.enforce(FACTORY).createAtomicInteger(3);

      strictEqual(atomic[Symbol.toPrimitive]('string'), "3", "toPrimitive with 'string' hint returns '3'");
      strictEqual(atomic[Symbol.toPrimitive]('number'), 3, "toPrimitive with 'number' hint returns 3");
      strictEqual(atomic[Symbol.toPrimitive]('boolean'), true, "toPrimitive with 'boolean' hint returns true");
      strictEqual(atomic[Symbol.toPrimitive]('default'), 3, "toPrimitive with 'default' hint returns 3");
    });
  });
});

assertGuard(guard, 
  "get", 
  "set", 
  "compareAndSet", 
  "incrementAndGet", 
  "decrementAndGet"
);


