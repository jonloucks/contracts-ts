import { describe, it } from "node:test";
import { ok } from "node:assert";

import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Method, Supplier, Type, check, fromType, guard, toValue } from "@jonloucks/contracts-ts/auxiliary/Supplier";
import { assertGuard } from "@jonloucks/contracts-ts/test/helper.test.js";

const FUNCTION_NAMES: (string | symbol)[] = [
  'supply'
];

describe('Supplier Tests', () => {
  it('isSupplier should return true for Supplier', () => {
    const supplier: Supplier<string> = {
      supply: function (): string {
        return "hello";
      }
    };
    ok(guard(supplier), 'Supplier should return true');
  });
});

describe('fromType Tests', () => {
  it('fromType should convert Method to Supplier', () => {
    const method: Method<number> = () => 42;
    const supplier: Supplier<number> = fromType<number>(method);
    ok(guard(supplier), 'fromType should return a valid Supplier');
  });

  it('fromType should return Supplier as is', () => {
    const originalSupplier: Supplier<number> = {
      supply: function (): number {
        return 42;
      }
    };
    const supplier: Supplier<number> = fromType<number>(originalSupplier);
    ok(supplier === originalSupplier, 'fromType should return the original Supplier');
  });

  it('fromType should convert value to Supplier', () => {
    const supplier: Supplier<number> = fromType<number>(100);
    ok(guard(supplier), 'fromType should return a valid Supplier for value');
    ok(supplier.supply() === 100, 'Supplier supply method should return the correct value');
  });
});

describe('check Tests', () => {
  it('check should return the Supplier if present', () => {
    const supplier: Supplier<string> = {
      supply: function (): string {
        return "hello";
      }
    };
    const checkedSupplier: Type<string> = check<string>(supplier);
    ok(checkedSupplier === supplier, 'check should return the original Supplier');
  });

  it('check should throw error if Supplier is null or undefined', () => {
    let errorCaught = false;
    try {
      check<string>(null as unknown as Type<string>);
    } catch (_) {
      used(_);
      errorCaught = true;
    }
    ok(errorCaught, 'check should throw an error for null Supplier');
  });
});

describe('toValue Tests', () => {
  it('toValue should return correct value for Supplier', () => {
    const supplier: Supplier<number> = {
      supply: () => 55
    };
    const result = toValue<number>(supplier);
    ok(result === 55, 'toValue should return the value supplied by Supplier');
  });

  it('toValue should return correct value for Method', () => {
    const method: Method<number> = () => 77;
    const result = toValue<number>(method);
    ok(result === 77, 'toValue should return the value returned by Method');
  });

  it('toValue should return correct value for direct value type', () => {
    const result = toValue<number>(88);
    ok(result === 88, 'toValue should return the direct value');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);