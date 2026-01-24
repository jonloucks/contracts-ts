import { ok } from "node:assert";
import { createAtomicBoolean, createAtomicInteger, createAtomicReference } from "@jonloucks/contracts-ts/auxiliary/Convenience";

// Convenience tests, all exports are simple inlines to fully tested functionality.

describe('Convenience Tests', () => {
  it('createAtomicBoolean works', () => {
    const atomicBoolean = createAtomicBoolean(true);
    ok(atomicBoolean.get() === true, 'AtomicBoolean should be initialized to true');
  });

  it('createAtomicInteger works', () => {
    const atomicInteger = createAtomicInteger(42);
    ok(atomicInteger.get() === 42, 'AtomicInteger should be initialized to 42');
  });

  it('createAtomicReference works', () => {
    const obj = { value: "test" };
    const atomicReference = createAtomicReference(obj);
    ok(atomicReference.get() === obj, 'AtomicReference should be initialized to the provided object');
  });
});
