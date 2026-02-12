import { describe, it } from "node:test";
import assert from "node:assert";

import { guardFunctions, hasFunction } from "@jonloucks/contracts-ts/api/Types";

describe("guardFunctions", () => {
  it("should return true when all functions are present", () => {
    const obj = {
      func1: (): void => { },
      func2: async (): Promise<void> => { },
    };

    assert.strictEqual(guardFunctions(obj, "func1", "func2"), true);
  });

  it("should return true for getter", () => {
    const obj = {
      get func1(): string { return "func1" },
      get func2(): string { return "func2" },
    };

    assert.strictEqual(guardFunctions(obj, "func1", "func2"), true);
  });

  it("should return false when any function is missing", () => {
    const obj = {
      func1: (): void => { },
    };

    assert.strictEqual(guardFunctions(obj, "func1", "func2"), false);
  });

  it("should return false when any function is not a function", () => {
    const obj = {
      func1: (): void => { },
      func2: "not a function",
    };

    assert.strictEqual(guardFunctions(obj, "func1", "func2"), false);
  });

  it("should return true when all functions are present", () => {
    const obj = {
      func1: (): void => { },
      func2: async (): Promise<void> => { },
    };

    assert.strictEqual(guardFunctions(obj, "func1", "func2"), true);
  });

  it("should return false when any function is missing", () => {
    const obj = {
      func1: (): void => { },
    };

    assert.strictEqual(guardFunctions(obj, "func1", "func2"), false);
  });

  it("should return false when any function is not a function", () => {
    const obj = {
      func1: (): void => { },
      func2: "not a function",
    };

    assert.strictEqual(guardFunctions(obj, "func1", "func2"), false);
  });

  it("mock example should not return true for missing functions", () => {
    const partial:{ func1: () => void } = {
      func1: function (): void {
        throw new Error("Function not implemented.");
      }
    };

    assert.strictEqual(guardFunctions(partial, "func1"), true);
    assert.strictEqual(guardFunctions(partial, "func1", "func2"), false);
  });
});

describe("hasFunction", () => {
  it("should return true when property is a function", (): void => {
    const obj = {
      func: (): void => { },
    };

    assert.strictEqual(hasFunction(obj, "func"), true);
  });

  it("should return true when property is an async function", (): void => {
    const obj = {
      asyncFunc: async (): Promise<void> => { },
    };

    assert.strictEqual(hasFunction(obj, "asyncFunc"), true);
  });

  it("should return false when property is not a function", (): void => {
    const obj = {
      notFunc: "string",
    };

    assert.strictEqual(hasFunction(obj, "notFunc"), false);
  });

  it("should return false when property does not exist", (): void => {
    const obj = {
      func: (): void => { },
    };

    assert.strictEqual(hasFunction(obj, "nonExistent"), false);
  });

  it("should return true when property is a getter", (): void => {
    const obj = {
      get myProp(): string {
        return "value";
      },
    };

    assert.strictEqual(hasFunction(obj, "myProp"), true);
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

    assert.strictEqual(hasFunction(obj, "myProp"), true);
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

    assert.strictEqual(hasFunction(obj, "myProp"), true);
  });

  it("should check inherited properties from prototype", (): void => {
    class Base {
      baseFunc(): void { }
    }
    const obj = new Base();

    assert.strictEqual(hasFunction(obj, "baseFunc"), true);
  });

  it("should return false when value is not an object", (): void => {
    assert.strictEqual(hasFunction("string", "prop"), false);
    assert.strictEqual(hasFunction(123, "prop"), false);
    assert.strictEqual(hasFunction(null, "prop"), false);
    assert.strictEqual(hasFunction(undefined, "prop"), false);
  });

  it("should handle symbol properties", (): void => {
    const sym = Symbol("test");
    const obj = {
      [sym]: (): void => { },
    };

    assert.strictEqual(hasFunction(obj, sym), true);
  });

  it("should return false when symbol property does not exist", (): void => {
    const sym1 = Symbol("test1");
    const sym2 = Symbol("test2");
    const obj = {
      [sym1]: (): void => { },
    };

    assert.strictEqual(hasFunction(obj, sym2), false);
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

    assert.strictEqual(hasFunction(obj, "childFunc"), true);
    assert.strictEqual(hasFunction(obj, "parentFunc"), true);
    assert.strictEqual(hasFunction(obj, "grandParentFunc"), true);
  });

  it("should return false for non-function properties in the chain", (): void => {
    class Base {
      prop = "value";
    }
    const obj = new Base();

    assert.strictEqual(hasFunction(obj, "prop"), false);
  });
});