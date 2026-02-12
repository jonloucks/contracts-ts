import { describe, it } from "node:test";
import { ok } from "node:assert";

import { PromisorFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { assertContract, assertGuard } from "./helper.test.js";
import { Promisor, PromisorType } from "@jonloucks/contracts-ts/api/Promisor";
import { OptionalType, RequiredType, TransformType } from "@jonloucks/contracts-ts/api/Types";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

describe('guard tests', () => {
  it('guard should return true for PromisorFactory', () => {
    const instance: PromisorFactory = {
      createValue: function <T>(deliverable: OptionalType<T>): RequiredType<Promisor<T>> {
        used(deliverable);
        throw new Error("Function not implemented.");
      },
      createSingleton: function <T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
        used(promisor);
        throw new Error("Function not implemented.");
      },
      createLifeCycle: function <T>(promisor: PromisorType<T>): RequiredType<Promisor<T>> {
        used(promisor);
        throw new Error("Function not implemented.");
      },
      createExtractor: function <T, R>(promisor: PromisorType<T>, extractor: TransformType<T, R>): RequiredType<Promisor<R>> {
        used(promisor);
        used(extractor);
        throw new Error("Function not implemented.");
      }
    };
    ok(guard(instance), 'PromisorFactory should return true');
  });
});

assertGuard(guard, 'createExtractor', 'createLifeCycle', 'createSingleton', 'createValue');
assertContract(CONTRACT, 'PromisorFactory');
