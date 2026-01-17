import { AtomicInteger } from "@jonloucks/contracts-ts/api/auxiliary/AtomicInteger";
import { RequiredType } from "@jonloucks/contracts-ts/api/auxiliary/Types";

/**
 * Factory to create an AtomicInteger implementation
 * 
 * @param initialValue the initial number value
 * @returns the new AtomicInteger implementation
 */
export function create(initialValue?: number): RequiredType<AtomicInteger> {
  return AtomicIntegerImpl.internalCreate(initialValue);
}

// ---- Implementation details below ----

/**
 * Implementation of AtomicInteger.
 */
class AtomicIntegerImpl implements AtomicInteger {

  /**
   * AtomicInteger.incrementAndGet override
   */
  incrementAndGet(): number {
    return Atomics.add(this.array, 0, 1) + 1;
  }

  /** 
   * AtomicInteger.decrementAndGet override
   */
  decrementAndGet(): number {
    return Atomics.add(this.array, 0, -1) - 1;
  }

  /**
   * AtomicInteger.get override
   */
  get(): number {
    return Atomics.load(this.array, 0);
  }

  /** 
   * AtomicInteger.set override
   */
  set(value: number): void {
    Atomics.store(this.array, 0, value);
  }

  /** 
   * AtomicInteger.compareAndSet override
   */
  compareAndSet(expectedValue: number, newValue: number): boolean {
    const current = Atomics.compareExchange(this.array, 0, expectedValue, newValue);
    return current === expectedValue;
  }

  /** 
   * Object.toString override
   */
  toString(): string {
    return this.get().toString();
  }

  /** 
   *  [Symbol.toPrimitive] override
   */
  [Symbol.toPrimitive](hint: string): string | number | boolean {
    const value: number = this.get();
    switch (hint) {
      case 'string':
        return value.toString();
      case 'boolean':
        return value !== 0;
      default:
        return value;
    }
  }

  static internalCreate(initialValue?: number): AtomicInteger {
    return new AtomicIntegerImpl(initialValue);
  }

  private constructor(initialValue: number = 0) {
    this.set(initialValue);
  }

  private readonly buffer: SharedArrayBuffer = new SharedArrayBuffer(4);
  private readonly array: Int32Array = new Int32Array(this.buffer);
}


