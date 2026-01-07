import assert from 'node:assert';

import { Promisor, typeToPromisor, inlinePromisor, LAWYER } from "../api/Promisor";
import { OptionalType } from "../api/Types";

describe('api/Promisor.ts tests', () => {
    it('LAWYER.isDeliverable tests', () => {
            assert.strictEqual(LAWYER.isDeliverable(null), true, 'with null instance returns true');
            assert.strictEqual(LAWYER.isDeliverable(undefined), true, 'with undefined instance returns true');
            assert.strictEqual(LAWYER.isDeliverable("abc"), false, 'with string instance returns false');
            assert.strictEqual(LAWYER.isDeliverable({ demand: () => null }), false,  'with instance with demand returns false');
            assert.strictEqual(LAWYER.isDeliverable({ demand: () => null, incrementUsage: () => 1, decrementUsage: () => 1 }), true,
                'with instance with all properties returns true');
    });
});

describe('typeToPromisor tests', () => {
    it('with constructor type returns Promisor', () => {
        const promisor: Promisor<DummyClass> = typeToPromisor<DummyClass>(DummyClass);
        const instance: OptionalType<DummyClass> = promisor.demand();
        assert.ok(instance instanceof DummyClass);
    });
    it('with Promisor type returns same Promisor', () => {
        const originalPromisor: Promisor<DummyClass> = inlinePromisor<DummyClass>(() => new DummyClass(42));
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


class DummyClass {
    value: number;
    constructor(value: number = 0) {
        this.value = value;
    }
}

