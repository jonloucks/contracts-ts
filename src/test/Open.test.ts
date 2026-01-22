import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { Open, guard } from "@jonloucks/contracts-ts/api/Open";
import { assertGuard } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for Open', () => {
    const instance: Open = mock<Open>();
    ok(guard(instance), 'Open should return true');
  });
});

assertGuard(guard, "open");