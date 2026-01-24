import { throws } from "node:assert";

import { IllegalStateException } from "@jonloucks/contracts-ts/auxiliary/IllegalStateException";

describe('IllegalStateException Tests', () => {
  it('without message throws IllegalArgumentException', () => {
    throws(() => {
      new IllegalStateException(null as unknown as string);
    }, {
      name: 'IllegalArgumentException',
      message: 'Message must be present.'
    });
  });
  it('with message has correct name and message', () => {
    throws(() => {
      throw new IllegalStateException("Problem.");
    }, {
      name: 'IllegalStateException',
      message: "Problem."
    });
  });
});
