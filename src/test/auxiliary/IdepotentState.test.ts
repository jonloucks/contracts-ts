import { ok, strictEqual } from "node:assert";

import { IdempotentState, START_STATE, STATES } from "@jonloucks/contracts-ts/auxiliary/IdempotenState";

describe('Idempotent Tests', () => {
  it('should export IdempotentState type', () => {
    const state: IdempotentState = 'OPENED';
    strictEqual(state, 'OPENED', 'IdempotentState type should be exported correctly');
  });
  
  it('should have correct start state', () => {
    ok(START_STATE === 'OPENABLE', 'Start state should be OPENABLE');
  });

  it('should have correct states', () => {
    const expectedStates = ['OPENABLE', 'OPENING', 'OPENED', 'CLOSING', 'CLOSED', 'DESTROYED'];
    ok(JSON.stringify(STATES) === JSON.stringify(expectedStates), 'States should match expected states');
  });

  it('should contain OPENABLE state', () => {
    ok(STATES.includes('OPENABLE'), 'STATES should include OPENABLE');
  });

  it('should contain OPENING state', () => {
    ok(STATES.includes('OPENING'), 'STATES should include OPENING');
  });

  it('should contain OPENED state', () => {
    ok(STATES.includes('OPENED'), 'STATES should include OPENED');
  });

  it('should contain CLOSING state', () => {
    ok(STATES.includes('CLOSING'), 'STATES should include CLOSING');
  });

  it('should contain CLOSED state', () => {
    ok(STATES.includes('CLOSED'), 'STATES should include CLOSED');
  });

  it('should contain DESTROYED state', () => {
    ok(STATES.includes('DESTROYED'), 'STATES should include DESTROYED');
  });

});
