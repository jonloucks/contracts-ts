import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { AutoOpen, guard } from "@jonloucks/contracts-ts/api/AutoOpen";
import { assertGuard, mockGuardFix } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for AutoOpen', () => {
    const instance: MockProxy<AutoOpen> = mock<AutoOpen>();
    mockGuardFix(instance, "autoOpen");
    ok(guard(instance), 'AutoOpen should return true');
  });
});

assertGuard(guard, "autoOpen");