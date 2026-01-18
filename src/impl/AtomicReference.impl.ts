import { AtomicReference } from "@jonloucks/contracts-ts/api/auxiliary/AtomicReference";
import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";

/**
 * Factory method to create an AtomicReference
 * 
 * @param initialValue the initial value for the AtomicReference
 * @returns the new AtomicReference implementation
 */
export function create<T>(initialValue?: OptionalType<T>): RequiredType<AtomicReference<T>> {
  return AtomicReferenceImpl.internalCreate(initialValue);
}

// ---- Implementation details below ----

/**
 * AtomicReference implementation.
 */
export class AtomicReferenceImpl<T> implements AtomicReference<T> {

  /**
   * AtomicReference.get override
   */
  get(): OptionalType<T> {
    return this.value;
  }

  /** 
   * AtomicReference.set override
   */
  set(newValue: OptionalType<T>): void {
    this.value = newValue;
  }

  /** 
   * AtomicReference.compareAndSet override
   */
  compareAndSet(expectedValue: OptionalType<T>, newValue: OptionalType<T>): boolean {
    if (this.value === expectedValue) {
      this.value = newValue;
      return true;
    } else {
      return false;
    }
  }

  /** 
   * Object.toString override
   */
  toString(): string {
    return `Reference[${String(this.get())}]`;
  }

  static internalCreate<T>(initialValue?: OptionalType<T>): AtomicReference<T> {
    return new AtomicReferenceImpl<T>(initialValue);
  }

  private constructor(initialValue?: OptionalType<T>) {
    this.value = initialValue;
  }

  private value: OptionalType<T>;
}


