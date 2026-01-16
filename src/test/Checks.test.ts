import { IllegalArgumentException } from "@io.github.jonloucks/contracts-ts/api/auxiliary/IllegalArgumentException";
import { illegalCheck, nameCheck, typeCheck } from "../api/auxiliary/Checks";

describe("typeCheck", () => {
  it("should pass for valid types", () => {
    expect(typeCheck<string>("test")).toBe("test");
    expect(typeCheck<number>(42,)).toBe(42);
    expect(typeCheck<boolean>(true)).toBe(true);
    expect(typeCheck<object>({ key: "value" })).toEqual({ key: "value" });
  });

  it("should throw IllegalArgumentException for null or undefined", () => {
    expect(() => typeCheck<string>(null as unknown as string))
      .toThrow(new IllegalArgumentException("Type must be present."));
    expect(() => typeCheck<number>(undefined as unknown as number))
      .toThrow(new IllegalArgumentException("Type must be present."));
  });
});

describe("nameCheck", () => {
  it("should pass for valid types", () => {
    expect(nameCheck<string>("test")).toBe("test");
    expect(nameCheck<number>(42,)).toBe(42);
    expect(nameCheck<boolean>(true)).toBe(true);
    expect(nameCheck<object>({ key: "value" })).toEqual({ key: "value" });
  });

  it("should throw IllegalArgumentException for null or undefined", () => {
    expect(() => nameCheck<string>(null as unknown as string))
      .toThrow(new IllegalArgumentException("Name must be present."));
    expect(() => nameCheck<number>(undefined as unknown as number))
      .toThrow(new IllegalArgumentException("Name must be present."));
  });
});

describe("illegalCheck", () => {
  it("should pass for valid types", () => {
    expect(illegalCheck<string | null>(null, false, "Ouch.")).toBe(null);
    expect(illegalCheck<string | undefined>(undefined, false, "Ouch.")).toBe(undefined);
    expect(illegalCheck<string>("test", false, "Ouch.")).toBe("test");
    expect(illegalCheck<number>(42, false, "Ouch.")).toBe(42);
    expect(illegalCheck<boolean>(true, false, "Ouch.")).toBe(true);
    expect(illegalCheck<object>({ key: "value" }, false, "Ouch.")).toEqual({ key: "value" });
  });

  it("should throw for valid types", () => {
    expect(() => illegalCheck<string>("test", false, null as unknown as string))
      .toThrow(new IllegalArgumentException("Message for illegal check must be present."));
  });
});