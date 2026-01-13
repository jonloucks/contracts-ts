import assert from 'node:assert';

import { AtomicInteger, LAWYER } from "contracts-ts/api/AtomicInteger";
import { CONTRACT as FACTORY, LAWYER as FACTORY_LAWYER } from "contracts-ts/api/AtomicIntegerFactory";
import { Contracts } from "contracts-ts/api/Contracts";
import { Tools } from "contracts-ts/test/Test.tools.test";
import { generateTestsForLawyer } from './Lawyer.tools.test';

describe('AtomicInteger', () => {

    it('LAWYER.isDeliverable', () => {
        assert.strictEqual(LAWYER.isDeliverable(null), true);
        assert.strictEqual(LAWYER.isDeliverable(undefined), true);
        assert.strictEqual(LAWYER.isDeliverable({}), false);
        assert.strictEqual(LAWYER.isDeliverable({
            get: () => 0,
            set: (value: number) => { },
            compareAndSet: (expectedValue: number, newValue: number) => true,
            incrementAndGet: () => 1,
            decrementAndGet: () => -1
        }), true);
        assert.strictEqual(LAWYER.isDeliverable({
            get: () => 0,
            set: (value: number) => { },
            // compareAndSet: (expectedValue: number, newValue: number) => true,
            incrementAndGet: () => 1,
            decrementAndGet: () => -1
        }), false);
    });

    it('AtomicInteger FACTORY works', () => {
        Tools.withContracts((contracts: Contracts) => {
            assert.strictEqual(contracts.isBound(FACTORY), true);
            const atomic: AtomicInteger = contracts.enforce(FACTORY).create();
            assert.notStrictEqual(atomic, null);
        });
    });

    it('AtomicInteger methods work', () => {
        Tools.withContracts((contracts: Contracts) => {
            const atomic: AtomicInteger = contracts.enforce(FACTORY).create();
            assert.strictEqual(atomic.get(), 0);
            assert.strictEqual(atomic.toString(), "0");
            atomic.set(5);
            assert.strictEqual(atomic.get(), 5);
            const updated = atomic.compareAndSet(5, 10);
            assert.strictEqual(updated, true);
            assert.strictEqual(atomic.get(), 10);
            const notUpdated = atomic.compareAndSet(5, 15);
            assert.strictEqual(notUpdated, false);
            assert.strictEqual(atomic.get(), 10);
            const incremented = atomic.incrementAndGet();
            assert.strictEqual(incremented, 11);
            const decremented = atomic.decrementAndGet();
            assert.strictEqual(decremented, 10);
            assert.strictEqual(atomic.toString(), "10");
        });
    });

    it('AtomicInteger Symbol.toPrimitive', () => {
        Tools.withContracts((contracts: Contracts) => {
            const atomic: AtomicInteger = contracts.enforce(FACTORY).create(3);

            const primitiveString = atomic[Symbol.toPrimitive]('string');
            const primitiveNumber = atomic[Symbol.toPrimitive]('number');
            const primitiveBoolean = atomic[Symbol.toPrimitive]('boolean');
            const primitiveDefault = atomic[Symbol.toPrimitive]('default');

            assert.strictEqual(primitiveString, "3");
            assert.strictEqual(primitiveNumber, 3);
            assert.strictEqual(primitiveBoolean, true);
            assert.strictEqual(primitiveDefault, 3);
        });
    });

    it('FACTORY_LAWYER.isDeliverable', () => {
        Tools.withContracts((contracts: Contracts) => {
            assert.strictEqual(FACTORY_LAWYER.isDeliverable(() => { return {}; }), false, "with function is false");

            let duck = { create: () => { return {}; } };
            assert.strictEqual(FACTORY_LAWYER.isDeliverable(duck), true, "with duck-type is true");
            assert.strictEqual(FACTORY_LAWYER.isDeliverable("abc"), false, "with string is false");
            assert.strictEqual(FACTORY_LAWYER.isDeliverable(123), false, "with number is false");
            assert.strictEqual(FACTORY_LAWYER.isDeliverable({}), false, "with empty object is false");

            const atomic: AtomicInteger = contracts.enforce(FACTORY).create();
            assert.strictEqual(FACTORY_LAWYER.isDeliverable(atomic), false, 'with AtomicInteger is false');
        });
    });
});
generateTestsForLawyer(LAWYER);


