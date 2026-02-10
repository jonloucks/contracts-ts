import { ok } from "node:assert";

import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Method, Transform, Type, check, fromType, guard, toValue } from "@jonloucks/contracts-ts/auxiliary/Transform";
import { assertGuard, mockDuck } from "../helper.test";

const FUNCTION_NAMES: (string | symbol)[] = [
  'transform'
];

describe('Transform Tests', () => {
  it('isTransform should return true for Transform', () => {
    const Transform: Transform<string, number> = mockDuck<Transform<string, number>>(...FUNCTION_NAMES);
    ok(guard(Transform), 'Transform should return true');
  });
});

describe('fromType Tests', () => {
  it('fromType should convert Method to Transform', () => {
    const method: Method<string, number> = (input: string) => { used(input); return 42; };
    const Transform: Transform<string, number> = fromType<string, number>(method);
    ok(guard(Transform), 'fromType should return a valid Transform');
  });

  it('fromType should return Transform as is', () => {
    const originalTransform: Transform<string, number> = mockDuck<Transform<string, number>>(...FUNCTION_NAMES);
    const Transform: Transform<string, number> = fromType<string, number>(originalTransform);
    ok(Transform === originalTransform, 'fromType should return the original Transform');
  });

  it('fromType should convert value to Transform', () => {
    const Transform: Transform<string, number> = fromType<string, number>(100);
    ok(guard(Transform), 'fromType should return a valid Transform for value');
    ok(Transform.transform("100") === 100, 'Transform transform method should return the correct value');
  });
});

describe('check Tests', () => {
  it('check should return the Transform if present', () => {
    const Transform: Transform<string,number> = mockDuck<Transform<string,number>>(...FUNCTION_NAMES);
    const checkedTransform: Type<string,number> = check<string,number>(Transform);
    ok(checkedTransform === Transform, 'check should return the original Transform');
  });

  it('check should throw error if Transform is null or undefined', () => {
    let errorCaught = false;
    try {
      check<string,number>(null as unknown as Type<string,number>);
    } catch (_) {
      used(_);
      errorCaught = true;
    }
    ok(errorCaught, 'check should throw an error for null Transform');
  });
});

describe('toValue Tests', () => {
  it('toValue should return correct value for Transform', () => {
    const Transform: Transform<string, number> = {
      transform: () => 55
    };
    const result : number = toValue<string, number>(Transform, "input");
    ok(result === 55, 'toValue should return the value supplied by Transform');
  });

  it('toValue should return correct value for Method', () => {
    const method: Method<string, number> = (text: string) => { used(text); return 77; };
    const result : number = toValue<string, number>(method, "input");
    ok(result === 77, 'toValue should return the value returned by Method');
  });

  it('toValue should return correct value for direct value type', () => {
    const result : number = toValue<string,number>(88, "ignored");
    ok(result === 88, 'toValue should return the direct value');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);