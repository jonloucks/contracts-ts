import { describe, it } from "node:test";
import { illegalCheck, nameCheck, typeCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { IllegalArgumentException } from "@jonloucks/contracts-ts/auxiliary/IllegalArgumentException";
import { strictEqual, throws } from "node:assert";

describe("typeCheck", () => {
  it("should pass for valid types", () => {
    strictEqual(typeCheck<string>("test"), "test");
    strictEqual(typeCheck<number>(42), 42);
    strictEqual(typeCheck<boolean>(true), true);
    // strictEqual(typeCheck<object>({ key: "value" }), { key: "value" });
  });

  it("should throw IllegalArgumentException for null or undefined", () => {
    throws(() => typeCheck<string>(null as unknown as string), new IllegalArgumentException("Type must be present."));
    throws(() => typeCheck<number>(undefined as unknown as number), new IllegalArgumentException("Type must be present."));
  });
});

describe("nameCheck", () => {
  it("should pass for valid types", () => {
    strictEqual(nameCheck<string>("test"), "test");
    strictEqual(nameCheck<number>(42,), 42);
    strictEqual(nameCheck<boolean>(true), true);
    // strictEqual(nameCheck<object>({ key: "value" }), { key: "value" });
  });

  it("should throw IllegalArgumentException for null or undefined", () => {
    throws(() => nameCheck<string>(null as unknown as string), new IllegalArgumentException("Name must be present."));
    throws(() => nameCheck<number>(undefined as unknown as number), new IllegalArgumentException("Name must be present."));
  });
});

describe("illegalCheck", () => {
  it("should pass for valid types", () => {
    strictEqual(illegalCheck<string | null>(null, false, "Ouch."), null);
    strictEqual(illegalCheck<string | undefined>(undefined, false, "Ouch."), undefined);
    strictEqual(illegalCheck<string>("test", false, "Ouch."), "test");
    strictEqual(illegalCheck<number>(42, false, "Ouch."), 42);
    strictEqual(illegalCheck<boolean>(true, false, "Ouch."), true);
    // strictEqual(illegalCheck<object>({ key: "value" }, false, "Ouch."), { key: "value" });
  });

  it("should throw for valid types", () => {
    throws(() => illegalCheck<string>("test", false, null as unknown as string), new IllegalArgumentException("Message for illegal check must be present."));
  });
});