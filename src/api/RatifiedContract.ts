import { BasicContract } from "contracts-ts/api/BasicContract";
import { Config, Contract } from "contracts-ts/api/Contract";
import { ContractException } from "contracts-ts/api/ContractException";
import { OptionalType, RequiredType, isNotPresent, isPresent } from "contracts-ts/api/Types";

/**
 * A RatifiedContract is a Contract that has been verified to have either a test or cast function.
 * This ensures that the contract can actually perform some form of validation or transformation.
 *
 * @param <T> the type of deliverable for this Contract
 * @param config the configuration for the RatifiedContract
 * @returns the created RatifiedContract
 */
export function create<T>(config?: Config<T> | null): Contract<T> {
  return RatifiedContract.create<T>(config);
}

/**
 * Checks if the given instance is a RatifiedContract.
 * @param instance the instance to check
 * @returns true if the instance is a RatifiedContract, false otherwise
 */
export function isRatifiedContract(instance: unknown): instance is RatifiedContract<unknown> {
  return RatifiedContract.isRatifiedContract(instance);
}

/**
 * Checks if the given configuration is ratifiable.
 * 
 * @param config the configuration to check
 * @returns true if the configuration is ratifiable, false otherwise
 */
export function isRatifiableConfig<T>(config?: OptionalType<Config<T>>): config is RequiredType<Config<T>> {
  if (isNotPresent(config)) {
    return false;
  }
  return isPresent(config.test) || isPresent(config.cast);
}

/**
 * A RatifiedContract is a Contract that has been verified to have either a test or cast function.
 * This ensures that the contract can actually perform some form of validation or transformation.
 *
 * @param <T> the type of deliverable for this Contract
 */
class RatifiedContract<T> extends BasicContract<T> {

  /**
    * Create a contract derived from the given configuration
    *
    * @param config the name for the contract, null is not allowed
    * @param <T>    the type of deliverable for this Contract
    * @return the new Contract
    */
  static create<T>(config?: Config<T> | null): Contract<T> {
    return new RatifiedContract<T>(config);
  }

  static isRatifiedContract(instance: unknown): instance is RatifiedContract<unknown> {
    if (isNotPresent(instance)) {
      return false;
    }
    try {
      const candidate = instance as RatifiedContract<unknown>;
      return candidate.#secret === RatifiedContract.#SECRET;
    } catch {
      return false;
    }
  }

  /**
   * Being a RatifiedContract means something special. It is not something that you proclaim
   * by extending the class or duck-typing.
   * This is an integrity check to prevent duck-typing or extending Contract class.
   * Since private constructors can still be invoked.
   * This is not a security mechanism, just an integrity check.
   * This relies on TypeScript private fields which are enforced at runtime.
   * 
   * @throws ContractException when integrity check fails
   */
  private integrityCheck(): void {
    if (this.#secret !== RatifiedContract.#SECRET) {
      throw new ContractException('Integrity violation detected. This is not permitted.');
    }
  }

  private constructor(config?: OptionalType<Config<T>>) {
    super(RatifiedContract.validateConfig(config));
    Object.freeze(this);
    this.integrityCheck();
  }

  private static validateConfig<T>(config?: OptionalType<Config<T>>): RequiredType<Config<T>> {
    if (isRatifiableConfig(config)) {
      return config as RequiredType<Config<T>>;
    }
    throw new ContractException("RatifiedContract requires either a test or cast function must be present.");
  }

  static readonly #SECRET: symbol = Symbol("Contract");
  readonly #secret: symbol = RatifiedContract.#SECRET;
}