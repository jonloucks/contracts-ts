import { Open, OpenType } from "@jonloucks/contracts-ts/api/Open";
import { State } from "@jonloucks/contracts-ts/auxiliary/IdempotenState";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { guardFunctions, RequiredType } from "@jonloucks/contracts-ts/api/Types";

/** 
 * The configuration used to create a new Idempotent instance
 */
export interface Config {

  /** The Contracts instance to use */
  contracts?: Contracts;

  /** The Open type to use when opening the Idempotent */
  open: OpenType;
}

/**
 * The Idempotent API
 */
export interface Idempotent extends Open {

  /**
   * Get the current state of the Idempotent
   *
   * @return the current state
   */
  getState(): State;

  /**
   * Determine if the Idempotent is open
   *
   * @return true if the Idempotent is open
   */
  isOpen(): boolean;
}

/**
 * Determine if an instance implements Idempotent
 * 
 * @param instance the instance to check
 * @returns true if the instance implements Idempotent
 */
export function guard(instance: unknown): instance is RequiredType<Idempotent> {
  return guardFunctions(instance,
    'getState',
    'open',
    'isOpen',
  );
} 
