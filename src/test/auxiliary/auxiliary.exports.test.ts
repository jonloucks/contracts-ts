import { describe, it } from "node:test";
import { ok, strictEqual } from "node:assert";

import { OptionalType } from "@jonloucks/contracts-ts/api/Types";
import { AtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/AtomicBoolean";
import { AtomicBooleanFactory } from "@jonloucks/contracts-ts/auxiliary/AtomicBooleanFactory";
import { AtomicInteger } from "@jonloucks/contracts-ts/auxiliary/AtomicInteger";
import { AtomicIntegerFactory } from "@jonloucks/contracts-ts/auxiliary/AtomicIntegerFactory";
import { AtomicReference } from "@jonloucks/contracts-ts/auxiliary/AtomicReference";
import { AtomicReferenceFactory } from "@jonloucks/contracts-ts/auxiliary/AtomicReferenceFactory";
import { presentCheck, used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { IllegalArgumentException } from "@jonloucks/contracts-ts/auxiliary/IllegalArgumentException";
import { IllegalStateException } from "@jonloucks/contracts-ts/auxiliary/IllegalStateException";
import { validateContracts } from "@jonloucks/contracts-ts/auxiliary/Validate";

/** 
 * Tests for @jonloucks/contracts-ts/auxiliary exports
 * All exported functions and constants must already have been tested in their respective test files
 * These tests ensure that the index exports are correctly set up and accessible
 * If this file fails to compile, it indicates a possible breaking for deployment consumers
 */

describe('auxiliary exports', () => {
  it('should export all expected members', () => {
    strictEqual(presentCheck("green", "not easy being green"), "green");
    assertNothing(null as OptionalType<AtomicBoolean>);
    assertNothing(null as OptionalType<AtomicBooleanFactory>);
    assertNothing(null as OptionalType<AtomicInteger>);
    assertNothing(null as OptionalType<AtomicIntegerFactory>);
    assertNothing(null as OptionalType<AtomicReference<string>>);
    assertNothing(null as OptionalType<AtomicReferenceFactory>);
    assertNothing(null as OptionalType<IllegalArgumentException>);
    assertNothing(null as OptionalType<IllegalStateException>);
    assertNothing(null as OptionalType<typeof validateContracts>);
  });
});

function assertNothing(value: OptionalType<unknown>): void {
  used(value);
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}
