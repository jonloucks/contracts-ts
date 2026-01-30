import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { PromisorFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { assertContract, assertGuard, mockGuardFix } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for PromisorFactory', () => {
    const instance: MockProxy<PromisorFactory> = mock<PromisorFactory>();
    mockGuardFix(instance, 'createExtractor', 'createLifeCycle', 'createSingleton', 'createValue');
    ok(guard(instance), 'PromisorFactory should return true');
  });
});

assertGuard(guard, 'createExtractor', 'createLifeCycle', 'createSingleton', 'createValue');
assertContract(CONTRACT, 'PromisorFactory');
