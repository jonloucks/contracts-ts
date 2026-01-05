import { Contract } from './contract';

/**
 * A simple container for managing contracts and their implementations
 */
export class Container {
  private bindings = new Map<symbol, unknown>();

  /**
   * Bind a contract to an implementation
   * @param contract The contract to bind
   * @param implementation The implementation to bind
   */
  bind<T>(contract: Contract<T>, implementation: T): void {
    this.bindings.set(contract.id, implementation);
  }

  /**
   * Resolve a contract to its implementation
   * @param contract The contract to resolve
   * @returns The implementation bound to the contract
   * @throws Error if the contract is not bound
   */
  resolve<T>(contract: Contract<T>): T {
    const implementation = this.bindings.get(contract.id);
    if (implementation === undefined) {
      throw new Error(
        `Contract ${contract.name || contract.id.toString()} is not bound`
      );
    }
    return implementation as T;
  }

  /**
   * Check if a contract is bound
   * @param contract The contract to check
   * @returns True if the contract is bound, false otherwise
   */
  has<T>(contract: Contract<T>): boolean {
    return this.bindings.has(contract.id);
  }

  /**
   * Clear all bindings
   */
  clear(): void {
    this.bindings.clear();
  }
}
