import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { AutoOpen, guard } from "@jonloucks/contracts-ts/api/AutoOpen";
import { assertGuard } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for AutoOpen', () => {
    const instance: AutoOpen = mock<AutoOpen>();
    ok(guard(instance), 'AutoOpen should return true');
  });
});

assertGuard(guard, "open");