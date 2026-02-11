/**
 * The possible states of an Idempotent
 */
export const STATES = ['OPENABLE', 'OPENING', 'OPENED', 'CLOSING', 'CLOSED', 'DESTROYED'] as const;

/** The possible states of an Idempotent */
export type State = typeof STATES[number];

/** The IdempotentState type */
export { type State as IdempotentState };

/** The starting state for an Idempotent */
export const START_STATE: State = 'OPENABLE';
