import { ok } from "node:assert";

import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Consumer, Method, Type, check, fromType, guard } from "@jonloucks/contracts-ts/auxiliary/Consumer";
import { assertGuard, mockDuck } from "../helper.test";

const FUNCTION_NAMES: (string | symbol)[] = [
  'consume'
];

describe('Consumer Tests', () => {
  it('isConsumer should return true for Consumer', () => {
    const consumer: Consumer<string> = mockDuck<Consumer<string>>(...FUNCTION_NAMES);
    ok(guard(consumer), 'Consumer should return true');
  });
});

describe('fromType Tests', () => {
  it('fromType should convert Method to Consumer', () => {
    const method: Method<number> = (_: number) => {
      used(_);
      /* do nothing */
    };
    const consumer: Consumer<number> = fromType<number>(method);
    ok(guard(consumer), 'fromType should return a valid Consumer');
  });

  it('fromType should return Consumer as is', () => {
    const originalConsumer: Consumer<number> = mockDuck<Consumer<number>>(...FUNCTION_NAMES);
    const consumer: Consumer<number> = fromType<number>(originalConsumer);
    ok(consumer === originalConsumer, 'fromType should return the original Consumer');
  });
});

describe('check Tests', () => {
  it('check should return the Consumer if present', () => {
    const consumer: Consumer<string> = mockDuck<Consumer<string>>(...FUNCTION_NAMES);
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