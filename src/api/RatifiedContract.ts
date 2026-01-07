import { OptionalType, RequiredType, isNullOrUndefined} from "./Types";
import { ClassCastException } from "./ClassCastException";
import { ContractException } from "./ContractException";
import { Contract, Config } from "./Contract";
import { BasicContract } from "./BasicContract";

export function create<T>(config?: Config<T> | null) : Contract<T> {
    return RatifiedContract.create<T>(config);
}

export function isRatifiedContract(instance: unknown): instance is RatifiedContract<unknown> {
    return RatifiedContract.isRatifiedContract(instance);
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
     * This is a security check to prevent duck-typing or extending Contract class.
     * 
     * Note: When invoked by the constructor it is early in the initialization phase so
     * most fields are not yet initialized.
     */
    private integrityCheck(): void {
        try {
            // Accessing private field to ensure it's really a Contract
             
            if (this.#secret !== RatifiedContract.#SECRET) {
                throw new Error("Identifier  mismatch.");
            }
        } catch (thrown) {
            throw new ContractException('Security violation detected. This is not permitted.');
        }
    }

    private constructor(config?: Config<T> | null) {
        super(RatifiedContract.validateConfig(config));
        this.integrityCheck();
        Object.freeze(this);
    }

    private static validateConfig<T>(config?: Config<T> | null): RequiredType<Config<T>> {
        if (isNullOrUndefined(config)) {
            RatifiedContract.throwRequirementsViolation();
        }

        if (isNullOrUndefined(config.test) && isNullOrUndefined(config.cast)) {
            RatifiedContract.throwRequirementsViolation();
        }

        return config;
    }

    private static throwRequirementsViolation(): never {
        throw new ContractException("RatifiedContract requirements violation: either a test or cast function must be present.");
    }

    static readonly #SECRET : symbol = Symbol("Contract");
    readonly #secret : symbol = RatifiedContract.#SECRET;
}