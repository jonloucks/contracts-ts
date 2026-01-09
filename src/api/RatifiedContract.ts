import { RequiredType, OptionalType, isNotNullOrUndefined, isNullOrUndefined } from "./Types";
import { ContractException } from "./ContractException";
import { Contract, Config } from "./Contract";
import { BasicContract } from "./BasicContract";

export function create<T>(config?: Config<T> | null): Contract<T> {
    return RatifiedContract.create<T>(config);
}

export function isRatifiedContract(instance: unknown): instance is RatifiedContract<unknown> {
    return RatifiedContract.isRatifiedContract(instance);
}

export function isRatifiableConfig<T>(config?: OptionalType<Config<T>>): config is RequiredType<Config<T>> {
    if (isNullOrUndefined(config)) {
        return false;
    }
    return isNotNullOrUndefined(config.test) || isNotNullOrUndefined(config.cast);
}

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
        if (isNullOrUndefined(instance)) {
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
     * Being a RatifiedContract means something special. It is not somehting that you proclaim
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

    private static validateConfig<T>(config?: OptionalType<Config<T>>) : RequiredType<Config<T>> {
        if (isRatifiableConfig(config)) {
            return config as RequiredType<Config<T>>;
        }
        throw new ContractException("RatifiedContract requires either a test or cast function must be present.");
    }

    static readonly #SECRET: symbol = Symbol("Contract");
    readonly #secret: symbol = RatifiedContract.#SECRET;
}