import { AtomicBoolean } from "contracts-ts/api/AtomicBoolean";
import { RequiredType } from "contracts-ts/api/Types";

/**
 * Factory to create an AtomicBoolean implementation
 * 
 * @param initialValue the initial boolean value
 * @returns the new AtomicBoolean implementation
 */
export function create(initialValue?: boolean): RequiredType<AtomicBoolean> {
  return AtomicBooleanImpl.internalCreate(initialValue);
}

// ---- Implementation details below ----

const FALSE_AS_NUMBER: number = 0;
const TRUE_AS_NUMBER: number = 1;

function booleanToNumber(value: boolean): number {
  return value ? TRUE_AS_NUMBER : FALSE_AS_NUMBER;
}

/**
 * Implementation of AtomicBoolean.
 */
class AtomicBooleanImpl implements AtomicBoolean {

  /**
   * AtomicBoolean.get override
   */
  get(): boolean {
    // Atomics.load ensures thread-safe reading
    return Atomics.load(this.array, 0) === TRUE_AS_NUMBER;
  }

  /** 
   * AtomicBoolean.set override
   */
  set(value: boolean): void {
    // Atomics.store ensures thread-safe writing
    Atomics.store(this.array, 0, value ? TRUE_AS_NUMBER : FALSE_AS_NUMBER);
  }

  /**
   * AtomicBoolean.compareAndSet override
   */
  compareAndSet(expected: boolean, newValue: boolean): boolean {
    const expectedVal: number = booleanToNumber(expected);
    const newTargetVal: number = booleanToNumber(newValue);

    // Atomics.compareExchange checks value and sets it if it matches expectation
    return Atomics.compareExchange(this.array, 0, expectedVal, newTargetVal) === expectedVal;
  }

  /** 
   * [Symbol.toPrimitive] override
   */
  [Symbol.toPrimitive](hint: string): string | boolean | number {
    const value: boolean = this.get();
    switch (hint) {
      case 'string':
        return value.toString();
      case 'number':
        return booleanToNumber(value);
      default:
        return value;
    }
  }

  /** 
   * Object.toString override
   */
  toString(): string {
    return this.get().toString();
  }

  static internalCreate(initialValue?: boolean): AtomicBoolean {
    return new AtomicBooleanImpl(initialValue ?? false);
  }

  private constructor(initialValue: boolean) {
    this.set(initialValue);
  }

  private readonly buffer: SharedArrayBuffer = new SharedArrayBuffer(4);
  private readonly array: Int32Array = new Int32Array(this.buffer);
}

