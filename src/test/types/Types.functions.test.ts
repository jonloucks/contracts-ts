import { guardFunctions } from "@jonloucks/contracts-ts/api/Types";

describe("hasFunctions", () => {
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
});

describe("hasFunctionsPresent", () => {
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
});