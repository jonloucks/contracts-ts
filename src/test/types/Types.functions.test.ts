import { MockProxy } from "jest-mock-extended";

import { guardFunctions, hasFunction } from "@jonloucks/contracts-ts/api/Types";
import { mockDuck } from "../helper.test";

describe("guardFunctions", () => {
  it("should return true when all functions are present", () => {
    const obj = {
      func1: (): void => { },
      func2: async (): Promise<void> => { },
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(true);
  });

  it("should return true for getter", () => {
    const obj = {
      get func1(): string { return "func1" },
      get func2(): string { return "func2" },
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(true);
  });

  it("should return false when any function is missing", () => {
    const obj = {
      func1: (): void => { },
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(false);
  });

  it("should return false when any function is not a function", () => {
    const obj = {
      func1: (): void => { },
      func2: "not a function",
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(false);
  });

  it("should return true when all functions are present", () => {
    const obj = {
      func1: (): void => { },
      func2: async (): Promise<void> => { },
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(true);
  });

  it("should return false when any function is missing", () => {
    const obj = {
      func1: (): void => { },
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(false);
  });

  it("should return false when any function is not a function", () => {
    const obj = {
      func1: (): void => { },
      func2: "not a function",
    };

    expect(guardFunctions(obj, "func1", "func2")).toBe(false);
  });

  it("mock example should not return true for missing functions", () => {
    const mocked: MockProxy<{ func1: () => void }> = mockDuck<{ func1: () => void }>("func1");

    expect(guardFunctions(mocked, "func1")).toBe(true);
    expect(guardFunctions(mocked, "func1", "func2")).toBe(false);
  });
});

describe("hasFunction", () => {
  it("should return true when property is a function", (): void => {
    const obj = {
      func: (): void => { },
    };

    expect(hasFunction(obj, "func")).toBe(true);
  });

  it("should return true when property is an async function", (): void => {
    const obj = {
      asyncFunc: async (): Promise<void> => { },
    };

    expect(hasFunction(obj, "asyncFunc")).toBe(true);
  });

  it("should return false when property is not a function", (): void => {
    const obj = {
      notFunc: "string",
    };

    expect(hasFunction(obj, "notFunc")).toBe(false);
  });

  it("should return false when property does not exist", (): void => {
    const obj = {
      func: (): void => { },
    };

    expect(hasFunction(obj, "nonExistent")).toBe(false);
  });

  it("should return true when property is a getter", (): void => {
    const obj = {
      get myProp(): string {
        return "value";
      },
    };

    expect(hasFunction(obj, "myProp")).toBe(true);
  });

  it("should return true when property is a setter", (): void => {
    let value = 0;
    const obj = {
      set myProp(v: number) {
        value = v;
      },
      get myValue(): number {
        return value;
      },
    };

    expect(hasFunction(obj, "myProp")).toBe(true);
  });

  it("should return true when property is both getter and setter", (): void => {
    let value = 0;
    const obj = {
      get myProp(): number {
        return value;
      },
      set myProp(v: number) {
        value = v;
      },
    };

    expect(hasFunction(obj, "myProp")).toBe(true);
  });

  it("should check inherited properties from prototype", (): void => {
    class Base {
      baseFunc(): void { }
    }
    const obj = new Base();

    expect(hasFunction(obj, "baseFunc")).toBe(true);
  });

  it("should return false when value is not an object", (): void => {
    expect(hasFunction("string", "prop")).toBe(false);
    expect(hasFunction(123, "prop")).toBe(false);
    expect(hasFunction(null, "prop")).toBe(false);
    expect(hasFunction(undefined, "prop")).toBe(false);
  });

  it("should handle symbol properties", (): void => {
    const sym = Symbol("test");
    const obj = {
      [sym]: (): void => { },
    };

    expect(hasFunction(obj, sym)).toBe(true);
  });

  it("should return false when symbol property does not exist", (): void => {
    const sym1 = Symbol("test1");
    const sym2 = Symbol("test2");
    const obj = {
      [sym1]: (): void => { },
    };

    expect(hasFunction(obj, sym2)).toBe(false);
  });

  it("should handle multiple levels of inheritance", (): void => {
    class GrandParent {
      grandParentFunc(): void { }
    }
    class Parent extends GrandParent {
      parentFunc(): void { }
    }
    class Child extends Parent {
      childFunc(): void { }
    }
    const obj = new Child();

    expect(hasFunction(obj, "childFunc")).toBe(true);
    expect(hasFunction(obj, "parentFunc")).toBe(true);
    expect(hasFunction(obj, "grandParentFunc")).toBe(true);
  });

  it("should return false for non-function properties in the chain", (): void => {
    class Base {
      prop = "value";
    }
    const obj = new Base();

    expect(hasFunction(obj, "prop")).toBe(false);
  });
});