import { ok, strictEqual } from "node:assert";

import { typeToTransform, Transform, TransformFunction } from "@jonloucks/contracts-ts/api/Types";

describe('typeToTransform tests', () => {
  it('with Transform returns same Transform', () => {
    const originalTransform: Transform<number, string> = {
      transform: (input: number) : string => input.toString()
    };
    const transform: Transform<number, string> = typeToTransform<number, string>(originalTransform);
    strictEqual(transform, originalTransform, "with Transform returns same Transform");
    strictEqual(transform.transform(42), "42", "with Transform returns Transform that works correctly");
  });
  it('with function returns Transform that uses function', () => {
    const func: TransformFunction<number, string> = (input: number) : string => input.toString();
    const transform: Transform<number, string> = typeToTransform<number, string>(func);
    ok(transform !== null, "with function returns non-null Transform");
    strictEqual(transform.transform(42), "42", "with function returns Transform that uses function correctly");
  });
  it('with unknown throws IllegalArgumentException', () => {
    let threw: boolean = false;
    try {
      // @ts-expect-error Testing runtime type check
      typeToTransform<number, string>(42);
    } catch (e) {
      threw = true;
      ok(e instanceof Error, "threw is an Error");
      strictEqual(e.name, "IllegalArgumentException", "threw is an IllegalArgumentException");
    }
    ok(threw, "with unknown throws IllegalArgumentException");
  });
});