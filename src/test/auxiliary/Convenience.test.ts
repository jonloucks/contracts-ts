import { describe, it } from "node:test";
import { ok } from "node:assert";
import { 
  createAtomicBoolean, 
  createAtomicInteger, 
  createAtomicReference, 
  createIdempotent,
  consumerCheck,
  consumerFromType,
  consumerGuard,
  predicateCheck,
  predicateFromType,
  predicateGuard,
  supplierCheck,
  supplierFromType,
  supplierGuard,
  supplierToValue,
  transformCheck,
  transformFromType,
  transformGuard,
  transformToValue,
} from "@jonloucks/contracts-ts/auxiliary/Convenience";
import { AutoCloseType } from "@jonloucks/contracts-ts/api/AutoClose";

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

  it('createIdempotent works', () => {
    const idempotent = createIdempotent({
      open: (): AutoCloseType => () => {}
    });
    ok(idempotent.isOpen() === false, 'Idempotent should be initially closed');
  });
});


describe("Functional Suite", () => {
  it("consumerGuard should be defined", (): void => {
    ok(typeof consumerGuard === "function", "consumerGuard should be a function");
  });

  describe("Functional exports", (): void => {
    it("consumerGuard should be exported", (): void => {
      ok(consumerGuard, "consumerGuard should be exported");
      ok(typeof consumerGuard === "function", "consumerGuard should be a function");
    });

    it("consumerFromType should be exported", (): void => {
      ok(consumerFromType, "consumerFromType should be exported");
      ok(typeof consumerFromType === "function", "consumerFromType should be a function");
    });

    it("consumerCheck should be exported", (): void => {
      ok(consumerCheck, "consumerCheck should be exported");
      ok(typeof consumerCheck === "function", "consumerCheck should be a function");
    });

    it("predicateGuard should be exported", (): void => {
      ok(predicateGuard, "predicateGuard should be exported");
      ok(typeof predicateGuard === "function", "predicateGuard should be a function");
    });

    it("predicateFromType should be exported", (): void => {
      ok(predicateFromType, "predicateFromType should be exported");
      ok(typeof predicateFromType === "function", "predicateFromType should be a function");
    });

    it("predicateCheck should be exported", (): void => {
      ok(predicateCheck, "predicateCheck should be exported");
      ok(typeof predicateCheck === "function", "predicateCheck should be a function");
    });

    it("supplierGuard should be exported", (): void => {
      ok(supplierGuard, "supplierGuard should be exported");
      ok(typeof supplierGuard === "function", "supplierGuard should be a function");
    });

    it("supplierFromType should be exported", (): void => {
      ok(supplierFromType, "supplierFromType should be exported");
      ok(typeof supplierFromType === "function", "supplierFromType should be a function");
    });

    it("supplierCheck should be exported", (): void => {
      ok(supplierCheck, "supplierCheck should be exported");
      ok(typeof supplierCheck === "function", "supplierCheck should be a function");
    });

    it("supplierToValue should be exported", (): void => {
      ok(supplierToValue, "supplierToValue should be exported");
      ok(typeof supplierToValue === "function", "supplierToValue should be a function");
    });

    it("transformGuard should be exported", (): void => {
      ok(transformGuard, "transformGuard should be exported");
      ok(typeof transformGuard === "function", "transformGuard should be a function");
    });

    it("transformFromType should be exported", (): void => {
      ok(transformFromType, "transformFromType should be exported");
      ok(typeof transformFromType === "function", "transformFromType should be a function");
    });

    it("transformCheck should be exported", (): void => {
      ok(transformCheck, "transformCheck should be exported");
      ok(typeof transformCheck === "function", "transformCheck should be a function");
    });

    it("transformToValue should be exported", (): void => {
      ok(transformToValue, "transformToValue should be exported");
      ok(typeof transformToValue === "function", "transformToValue should be a function");
    });
  });
});
