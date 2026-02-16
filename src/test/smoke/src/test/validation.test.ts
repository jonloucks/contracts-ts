import { test } from "node:test";
import { ok } from "node:assert";
import { CONTRACTS } from "@jonloucks/contracts-ts";

test("validate contracts", () => {
  ok(CONTRACTS, "Contracts should be defined.");
});
