import { notStrictEqual, ok, strictEqual } from "node:assert";

import { LAWYER, Promisor, typeToPromisor, unwrapPromisorType } from "@jonloucks/contracts-ts/api/Promisor";
import { OptionalType } from "@jonloucks/contracts-ts/api/Types";
import { generateTestsForLawyer } from "./Lawyer.tools.test";

describe('api/Promisor.ts tests', () => {
  it('LAWYER.isDeliverable tests', () => {
    strictEqual(LAWYER.isDeliverable(null), true, 'with null instance returns true');
    strictEqual(LAWYER.isDeliverable(undefined), true, 'with undefined instance returns true');
    strictEqual(LAWYER.isDeliverable("abc"), false, 'with string instance returns false');
    strictEqual(LAWYER.isDeliverable({ demand: () => null }), false, 'with instance with demand returns false');
    strictEqual(LAWYER.isDeliverable({ demand: () => null, incrementUsage: () => 1, decrementUsage: () => 1 }), true,
      'with instance with all properties returns true');
  });
});

describe('typeToPromisor tests', () => {
  it('with null returns Promisor that returns null', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(null);
    const instance: OptionalType<DummyClass> = promisor.demand();
    strictEqual(instance, null, "with null type returns null");
  });
  it('with undefined returns Promisor that returns undefined', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(undefined);
    const instance: OptionalType<DummyClass> = promisor.demand();
    strictEqual(instance, undefined, "with undefined type returns undefined");
  });
  it('with constructor type returns Promisor', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(DummyClass);
    const instance: OptionalType<DummyClass> = promisor.demand();
    ok(instance instanceof DummyClass);
  });
  it('with Promisor type returns same Promisor', () => {
    const originalPromisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(() => new DummyClass(42));
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(originalPromisor);
    strictEqual(promisor, originalPromisor, "with Promisor type returns same Promisor");
  });
  it('with function type returns Promisor', () => {
    const func = () : DummyClass=> new DummyClass(7);
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(func);
    const instance: OptionalType<DummyClass> = promisor.demand();
    ok(instance instanceof DummyClass, "with function type returns Promisor that returns instance");
    strictEqual(instance.value, 7, "with function type returns Promisor that returns instance with correct value");
  });
  it('with instance type returns Promisor', () => {
    const instance: DummyClass = new DummyClass(99);
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(instance);
    const demandedInstance: OptionalType<DummyClass> = promisor.demand();
    strictEqual(demandedInstance, instance, "with instance type returns Promisor that returns the same instance");
  });
  it('with Factory type returns Promisor', () => {
    const factory = () : DummyClass => new DummyClass(55);
    const factorySupplier = () : (() => DummyClass) => factory;
    const promisor: Promisor<() => DummyClass> = typeToPromisor<() => DummyClass>(factorySupplier);
    notStrictEqual(promisor, null, "with Factory type returns non-null Promisor");
    const actualFactory: OptionalType<() => DummyClass> = promisor.demand();
    notStrictEqual(actualFactory, null, "with Factory type returns Promisor that returns non-null factory");
    const instance = actualFactory!();
    ok(instance instanceof DummyClass, "with Factory type returns Promisor that returns instance");
    strictEqual(instance.value, 55, "with Factory type returns Promisor that returns instance with correct value");
  });
});

describe('unwrapPromisorType tests', () => {

  it('returns original type passed to typeToPromisor', () => {
    const originalInstance: DummyClass = new DummyClass(123);
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(originalInstance);
    const unwrappedType = unwrapPromisorType(promisor);
    strictEqual(unwrappedType, originalInstance, "returns original type passed to typeToPromisor");
  });
  it('with null type returns null', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(null);
    const unwrappedType = unwrapPromisorType(promisor);
    strictEqual(unwrappedType, null, "with null type returns null");
  });
  it('with undefined type returns undefined', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(undefined);
    const unwrappedType = unwrapPromisorType(promisor);
    strictEqual(unwrappedType, undefined, "with undefined type returns undefined");
  });
  it('with constructor type returns constructor', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(DummyClass);
    const unwrappedType = unwrapPromisorType(promisor);
    strictEqual(unwrappedType, DummyClass, "with constructor type returns constructor");
  });
  it('with undefined returns undefined', () => {
    strictEqual(unwrapPromisorType<DummyClass>(undefined), undefined, "with undefined returns undefined");
  });
  it('with null returns null', () => {
    strictEqual(unwrapPromisorType<DummyClass>(null), null, "with null returns null");
  });
  it('with custom instance returns same instance', () => {
    const promisor: Promisor<DummyClass> = new class implements Promisor<DummyClass> {
      demand(): OptionalType<DummyClass> {
        return new DummyClass(456);
      }
      incrementUsage(): number {
        return 1;
      }
      decrementUsage(): number {
        return 0;
      }
    };
  
    const unwrappedType = unwrapPromisorType(promisor);
    strictEqual(unwrappedType, promisor, "with custom instance returns same instance");
  });
});

generateTestsForLawyer(LAWYER);

class DummyClass {
  value: number;
  constructor(value: number = 0) {
    this.value = value;
  }
}

