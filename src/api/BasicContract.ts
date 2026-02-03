import { Config, Contract } from "@jonloucks/contracts-ts/api/Contract";
import { isNotPresent, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";

/**
 * Create a basic Contract
 * 
 * @param config the configuration for the Contract
 * @returns the created Contract
 */
export function create<T>(config?: Config<T> | null): RequiredType<Contract<T>> {
  return BasicContract.create<T>(config);
}

/**
 * Check if the given instance is a BasicContract
 * It does not enforce duck-typing checks, it is the
 * responsibility of the caller to ensure the instance is really the
 * correct deliverable type.
 * 
 * Class designed for extension.
 */
export class BasicContract<T> implements Contract<T> {

  /**
    * Create a contract derived from the given configuration
    *
    * @param config the name for the contract, null is not allowed
    * @param <T>    the type of deliverable for this Contract
    * @return the new Contract
    */
  static create<T>(config?: Config<T> | null): Contract<T> {
    return new BasicContract<T>(config);
  }

  /**
  * Casts the given object to the return type for this Contract
  * This is used to make sure the value is a checked value and does not sneak passed during erasure
  *
  * @param value the value to cast
  * @return the checked value. Note: null is possible. The Promisor is allowed to return null
  * @throws ContractException if the value can't be cast to the return type.
  */
  public cast(value: unknown | null | undefined): DeliveryType<T> {
    if (isNotPresent(value)) {
      if (this.#guarded) {
        this.throwCastException();
      } else {
        return value as DeliveryType<T>;
      }
    } if (this.#tester(value)) {
      return value;
    } else {
        this.throwCastException();
    }
  }

  /**
   * @return the contract name
   */
  public get name(): string {
    return this.#name;
  }

  /**
   * When guarded is true the Contract throws exception if deliverable is null or undefined
   * The default is true.
   */
  public get guarded(): boolean {
    return this.#guarded;
  }

  /**
   * Note: Do not rely on this being a java class name
   * Note: The actual class is never exposed and is by design.
   *
   * @return the type of deliverable for this contract.
   */
  public get typeName(): string {
    return this.#typeName;
  }

  /**
   * When replaceable a new binding can replace in an existing one
   * The default is false
   *
   * @return true if replaceable
   */
  public get replaceable(): boolean {
    return this.#replaceable;
  }

  /**
   * String representation of this Contract
   * Note: not intended to be parsed or relied on.
   * @returns a string representation of the contract
   */
  public toString(): string {
    let text = `Contract(id=${this.#id}`;
    if (this.name.length > 0) {
      text += `, name=${this.name}`;
    }
    if (this.typeName.length > 0) {
      text += `, type=${this.typeName}`;
    }
    text += `)`;
    return text;
  }

  /**
   * 
   * @param config 
   */
  public constructor(config?: Config<T> | null) {
    const candidateConfig: Config<T> = config ?? {};
    this.#replaceable = candidateConfig?.replaceable ?? false;
    this.#guarded = candidateConfig?.guarded ?? true;
    this.#name = candidateConfig?.name ?? "";
    this.#typeName = candidateConfig?.typeName ?? "";
    this.#tester = candidateConfig?.test ?? ((unknown): unknown is DeliveryType<T> => true);
  }

  private throwCastException(): never {
    // Note: message intentionally does not include the instance value
    throw new ContractException(`Casting error. Unable to cast '${this.toString()}'.`);
  }

  private static ID_GENERATOR: number = 1;

  readonly #id: number = BasicContract.ID_GENERATOR++;
  readonly #name: string;
  readonly #typeName: string;
  readonly #tester: TestType<T>;
  readonly #replaceable: boolean;
  readonly #guarded: boolean;
}

type DeliveryType<T> = OptionalType<T>;
type TestType<T> = (instance: unknown) => instance is DeliveryType<T>;