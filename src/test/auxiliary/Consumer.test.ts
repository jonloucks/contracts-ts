import { describe, it } from "node:test";
import { ok } from "node:assert";

import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Consumer, Method, Type, check, fromType, guard } from "@jonloucks/contracts-ts/auxiliary/Consumer";
import { assertGuard } from "@jonloucks/contracts-ts/test/helper.test.js";

const FUNCTION_NAMES: (string | symbol)[] = [
  'consume'
];

describe('Consumer Tests', () => {
  it('isConsumer should return true for Consumer', () => {
    const consumer: Consumer<string> = {
      consume: function (value: string): void {
        used(value);
      }
    };
    ok(guard(consumer), 'Consumer should return true');
  });
});

describe('fromType Tests', () => {
  it('fromType should convert Method to Consumer', () => {
    const method: Method<number> = (value: number) => {
      used(value);
      /* do nothing */
    };
    const consumer: Consumer<number> = fromType<number>(method);
    ok(guard(consumer), 'fromType should return a valid Consumer');
  });

  it('fromType should return Consumer as is', () => {
    const originalConsumer: Consumer<number> = {
      consume: function (value: number): void {
        used(value);
      }
    };
    const consumer: Consumer<number> = fromType<number>(originalConsumer);
    ok(consumer === originalConsumer, 'fromType should return the original Consumer');
  });
});

describe('check Tests', () => {
  it('check should return the Consumer if present', () => {
    const consumer: Consumer<string> = {
      consume: function (value: string): void {
        used(value);
      }
    };
    const checkedConsumer: Type<string> = check<string>(consumer);
    ok(checkedConsumer === consumer, 'check should return the original Consumer');
  });

  it('check should throw error if Consumer is null or undefined', () => {
    let errorCaught = false;
    try {
      check<string>(null as unknown as Type<string>);
    } catch (_) {
      used(_);
      errorCaught = true;
    }
    ok(errorCaught, 'check should throw an error for null Consumer');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);