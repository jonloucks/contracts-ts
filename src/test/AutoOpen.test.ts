import { ok } from "node:assert";
import { describe, it } from "node:test";

import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { AutoOpen, guard } from "@jonloucks/contracts-ts/api/AutoOpen";
import { assertGuard } from "@jonloucks/contracts-ts/test/helper.test";

describe('guard tests', () => {
  it('guard should return true for AutoOpen', () => {
    const instance: AutoOpen = {
      autoOpen: function (): AutoClose {
        throw new Error("Function not implemented.");
      }
    };
    ok(guard(instance), 'AutoOpen should return true');
  });
});

assertGuard(guard, "autoOpen");