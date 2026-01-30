import { mock, MockProxy } from "jest-mock-extended";

import { guardFunctions } from "@jonloucks/contracts-ts/api/Types";
import { mockGuardFix } from "../helper.test";

describe("guardFunctions", () => {
  it("should return true when all functions are present", () => {
    const obj = {
      func1: () : void => { },
      func2: async () : Promise<void> => { },
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(true);
  });

  it("should return false when any function is missing", () => {
    const obj = {
      func1: () : void => { },
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(false);
  });

  it("should return false when any function is not a function", () => {
    const obj = {
      func1: () : void => { },
      func2: "not a function",
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(false);
  });

  it("should return true when all functions are present", () => {
    const obj = {
      func1: () : void => { },
      func2: async () : Promise<void> => { },
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(true);
  });

  it("should return false when any function is missing", () => {
    const obj = {
      func1: () : void => { },
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(false);
  });

  it("should return false when any function is not a function", () => {
    const obj = {
      func1: () : void => { },
      func2: "not a function",
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(false);
  });

  it("mock example should not return true for missing functions", () => {
    const mocked : MockProxy<{ func1: () => void }> = mock<{ func1: () => void }>();

    mockGuardFix(mocked, "func1");

    expect(guardFunctions(mocked, "func1" )).toBe(true);
    expect(guardFunctions(mocked, "func1", "func2")).toBe(false);
  });
});