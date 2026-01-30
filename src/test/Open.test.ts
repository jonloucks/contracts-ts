import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { Open, guard } from "@jonloucks/contracts-ts/api/Open";
import { assertGuard, mockGuardFix } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for Open', () => {
    const instance: MockProxy<Open> = mock<Open>();
    mockGuardFix(instance, "open");
    ok(guard(instance), 'Open should return true');
  });
});

assertGuard(guard, "open");