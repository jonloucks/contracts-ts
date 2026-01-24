import { ok } from "node:assert";

import { isFunctionWithArity } from "@jonloucks/contracts-ts/api/Types";

describe("isFunctionWithArity", () => {
  it("should return true for functions with the specified arity", () => {
    const func1 = (_: number) : void => { };
    const func2 = (_: number, __: string) : void => { };
    const func3 = () : void => { };
    ok(isFunctionWithArity(func1, 1), "func1 has arity 1");
    ok(isFunctionWithArity(func2, 2), "func2 has arity 2");
    ok(isFunctionWithArity(func3, 0), "func3 has arity 0");
  });

  it("should return false for functions with different arity", () => {
    const func1 = (_: number) : void => { };
    const func2 = (_: number, __: string) : void => { };
    const func3 = () : void => { };
    ok(!isFunctionWithArity(func1, 2), "func1 does not have arity 2");
    ok(!isFunctionWithArity(func2, 1), "func2 does not have arity 1");
    ok(!isFunctionWithArity(func3, 1), "func3 does not have arity 1");
  });

  it("should return false for non-function values", () => {
    ok(!isFunctionWithArity(42, 1), "number is not a function");
    ok(!isFunctionWithArity("abc", 1), "string is not a function");
    ok(!isFunctionWithArity({}, 1), "object is not a function");
  });
});
