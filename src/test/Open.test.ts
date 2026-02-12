import { describe, it } from "node:test";
import { ok } from "node:assert";

import { Open, guard } from "@jonloucks/contracts-ts/api/Open";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { assertGuard } from "./helper.test.js";

describe('guard tests', () => {
  it('guard should return true for Open', () => {
    const instance: Open = {
      open: function (): AutoClose {
        throw new Error("Function not implemented.");
      }
    };
    ok(guard(instance), 'Open should return true');
  });
});

assertGuard(guard, "open");