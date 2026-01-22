import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { PromisorFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { assertContract, assertGuard } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for PromisorFactory', () => {
    const instance: PromisorFactory = mock<PromisorFactory>();
    ok(guard(instance), 'PromisorFactory should return true');
  });
});

assertGuard(guard, 'createExtractor', 'createLifeCycle', 'createSingleton', 'createValue');
assertContract(CONTRACT, 'PromisorFactory');
