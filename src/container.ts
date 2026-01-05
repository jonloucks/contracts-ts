/**
 * Contract is a unique identifier for a dependency.
 * It can be a symbol, string, or class constructor.
 */
export type Contract<T = any> = symbol | string | { new (...args: any[]): T };

/**
 * Container manages dependency registration and resolution.
 */
export class Container {
  private bindings = new Map<Contract, any>();
  private singletons = new Map<Contract, any>();

  /**
   * Bind a contract to a factory function.
   * The factory is called each time the dependency is resolved.
   */
  bind<T>(contract: Contract<T>, factory: (container: Container) => T): this {
    this.bindings.set(contract, factory);
    return this;
  }

  /**
   * Bind a contract to a singleton.
   * The factory is called once and the result is cached.
   */
  singleton<T>(contract: Contract<T>, factory: (container: Container) => T): this {
    this.bindings.set(contract, factory);
    this.singletons.set(contract, undefined);
    return this;
  }

  /**
   * Bind a contract to a constant value.
   */
  constant<T>(contract: Contract<T>, value: T): this {
    this.singletons.set(contract, value);
    return this;
  }

  /**
   * Resolve a dependency by its contract.
   */
  resolve<T>(contract: Contract<T>): T {
    // Check if it's a cached singleton
    if (this.singletons.has(contract)) {
      const cached = this.singletons.get(contract);
      if (cached !== undefined) {
        return cached;
      }
    }

    // Get the factory
    const factory = this.bindings.get(contract);
    if (!factory) {
      throw new Error(`No binding found for contract: ${String(contract)}`);
    }

    // Create the instance
    const instance = factory(this);

    // Cache if it's a singleton
    if (this.singletons.has(contract)) {
      this.singletons.set(contract, instance);
    }

    return instance;
  }

  /**
   * Check if a contract is bound.
   */
  has(contract: Contract): boolean {
    return this.bindings.has(contract) || this.singletons.has(contract);
  }

  /**
   * Clear all bindings.
   */
  clear(): void {
    this.bindings.clear();
    this.singletons.clear();
  }
}

/**
 * Create a new container instance.
 */
export function createContainer(): Container {
  return new Container();
}
