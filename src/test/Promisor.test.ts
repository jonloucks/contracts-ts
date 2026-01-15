import assert from "node:assert";

import { LAWYER, Promisor, typeToPromisor, unwrapPromisorType } from "contracts-ts/api/Promisor";
import { OptionalType } from "contracts-ts/api/auxiliary/Types";
import { generateTestsForLawyer } from "./Lawyer.tools.test";

describe('api/Promisor.ts tests', () => {
  it('LAWYER.isDeliverable tests', () => {
    assert.strictEqual(LAWYER.isDeliverable(null), true, 'with null instance returns true');
    assert.strictEqual(LAWYER.isDeliverable(undefined), true, 'with undefined instance returns true');
    assert.strictEqual(LAWYER.isDeliverable("abc"), false, 'with string instance returns false');
    assert.strictEqual(LAWYER.isDeliverable({ demand: () => null }), false, 'with instance with demand returns false');
    assert.strictEqual(LAWYER.isDeliverable({ demand: () => null, incrementUsage: () => 1, decrementUsage: () => 1 }), true,
      'with instance with all properties returns true');
  });
});

describe('typeToPromisor tests', () => {
  it('with null returns Promisor that returns null', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(null);
    const instance: OptionalType<DummyClass> = promisor.demand();
    assert.strictEqual(instance, null);
  });
  it('with undefined returns Promisor that returns undefined', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(undefined);
    const instance: OptionalType<DummyClass> = promisor.demand();
    assert.strictEqual(instance, undefined);
  });
  it('with constructor type returns Promisor', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(DummyClass);
    const instance: OptionalType<DummyClass> = promisor.demand();
    assert.ok(instance instanceof DummyClass);
  });
  it('with Promisor type returns same Promisor', () => {
    const originalPromisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(() => new DummyClass(42));
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(originalPromisor);
    assert.strictEqual(promisor, originalPromisor);
  });
  it('with function type returns Promisor', () => {
    const func = () => new DummyClass(7);
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(func);
    const instance: OptionalType<DummyClass> = promisor.demand();
    assert.ok(instance instanceof DummyClass);
    assert.strictEqual(instance.value, 7);
  });
  it('with instance type returns Promisor', () => {
    const instance: DummyClass = new DummyClass(99);
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(instance);
    const demandedInstance: OptionalType<DummyClass> = promisor.demand();
    assert.strictEqual(demandedInstance, instance);
  });
  it('with Factory type returns Promisor', () => {
    const factorySupplier = () => () => new DummyClass(55);
    const promisor: Promisor<() => DummyClass> = typeToPromisor<() => DummyClass>(factorySupplier);
    assert.notStrictEqual(promisor, null);
    const actualFactory: OptionalType<() => DummyClass> = promisor.demand();
    assert.notStrictEqual(actualFactory, null);
    const instance = actualFactory!();
    assert.ok(instance instanceof DummyClass);
    assert.strictEqual(instance.value, 55);
  });
});

describe('unwrapPromisorType tests', () => {

  it('returns original type passed to typeToPromisor', () => {
    const originalInstance: DummyClass = new DummyClass(123);
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(originalInstance);
    const unwrappedType = unwrapPromisorType(promisor);
    assert.strictEqual(unwrappedType, originalInstance);
  });
  it('with null type returns null', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(null);
    const unwrappedType = unwrapPromisorType(promisor);
    assert.strictEqual(unwrappedType, null);
  });
  it('with undefined type returns undefined', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(undefined);
    const unwrappedType = unwrapPromisorType(promisor);
    assert.strictEqual(unwrappedType, undefined);
  });
  it('with constructor type returns constructor', () => {
    const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(DummyClass);
    const unwrappedType = unwrapPromisorType(promisor);
    assert.strictEqual(unwrappedType, DummyClass);
  });
  it('with undefined returns undefined', () => {
    assert.strictEqual(unwrapPromisorType<DummyClass>(undefined), undefined);
  });
  it('with null returns null', () => {
    assert.strictEqual(unwrapPromisorType<DummyClass>(null), null);
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
    assert.strictEqual(unwrappedType, promisor);
  });
});

generateTestsForLawyer(LAWYER);

class DummyClass {
  value: number;
  constructor(value: number = 0) {
    this.value = value;
  }
}

