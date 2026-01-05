/**
 * A contract interface that can be implemented by classes
 * to provide dependency inversion
 * @template T The type that this contract represents
 */
export interface Contract<T = unknown> {
  /**
   * The contract identifier
   */
  readonly id: symbol;

  /**
   * Optional contract name for debugging
   */
  readonly name?: string;
}

/**
 * Create a new contract with a unique identifier
 * @param name Optional name for debugging purposes
 * @returns A new contract instance
 */
export function createContract<T>(name?: string): Contract<T> {
  return {
    id: Symbol(name),
    name
  };
}
