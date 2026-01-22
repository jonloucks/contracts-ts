import { guardFunctions, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";

/**
 * Configuration for a Contract
 * 
 * @param <T> The Contract deliverable type
 */
export interface Config<T> {

  /**
   * the predefine test to check if instance is of type T
   * @param instance the instance to check
   * @returns true if the instance is of type T, false otherwise
   */
  test?: (instance: unknown) => instance is RequiredType<T>;

  /**
   * User defined name for this contract.
   * Note: Do not rely on this being a java class name
   *
   * @return the type name
   */
  name?: string;

  /**
   * The type of deliverable for this contract.
   * Note: Do not rely on this being a java class name
   *
   * @return the type name, null is illegal
   */
  typeName?: string;

  /**
   * When replaceable a new binding can replace in an existing one
   * The default is false
   *
   * @return true if replaceable
   */
  replaceable?: boolean;

  /**
   * When ratified is true the Contract is a RatifiedContract
   * and must comply with RatifiedContract rules.
   */
  ratified?: boolean;

  /**   
   * When guarded is true the Contract throws exception if deliverable is null or undefined
   * The default is true.
   */
  guarded?: boolean;
}

/**
 * A Contract defines a deliverable type by name and type.
 * Note: This is a final class and should not be extended!
 * @param <T> the type of deliverable for this Contract
 */
export interface Contract<T> {

  /**
  * Casts the given object to the return type for this Contract
  * This is used to make sure the value is a checked value and does not sneak passed during erasure
  *
  * @param value the value to cast
  * @return the checked value. Note: null is possible. The Promisor is allowed to return null
  * @throws ContractException if the value can't be cast to the return type.
  */
  cast(value: OptionalType<unknown>): OptionalType<T>;

  /**
   * @return the contract name
   */
  get name(): string;

  /**
   * Note: Do not rely on this being a java class name
   * Note: The actual class is never exposed and is by design.
   *
   * @return the type of deliverable for this contract.
   */
  get typeName(): string;

  /**
   * When replaceable a new binding can replace in an existing one
   * The default is false
   *
   * @return true if replaceable
   */
  get replaceable(): boolean;

  /**
   * When guarded is true the Contract throws exception if deliverable is null or undefined
   * The default is true.
   */
  get guarded(): boolean;
}

/**
 * Duck-typing check for Contract interface.
 *
 * @param instance the instance to check
 * @returns true if the instance implements Contract, false otherwise
 */
export function guard<T>(instance: unknown): instance is RequiredType<Contract<T>> {
  return guardFunctions(instance, 'cast', 'name', 'typeName', 'replaceable');
}




