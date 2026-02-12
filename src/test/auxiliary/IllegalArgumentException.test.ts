import { describe, it } from "node:test";
import { throws } from "node:assert";

import { IllegalArgumentException } from "@jonloucks/contracts-ts/auxiliary/IllegalArgumentException";

describe('IllegalArgumentException Tests', () => {
  it('without message throws IllegalArgumentException', () => {
    throws(() => {
      new IllegalArgumentException(null as unknown as string);
    }, {
      name: 'IllegalArgumentException',
      message: 'Message must be present.'
    });
  });
  it('with message has correct name and message', () => {
    throws(() => {
      throw new IllegalArgumentException("Problem.");
    }, {
      name: 'IllegalArgumentException',
      message: "Problem."
    });
  });
});

