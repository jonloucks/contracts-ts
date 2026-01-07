import { OptionalType, isNullOrUndefined} from "./Types";
import { ClassCastException } from "./ClassCastException";
import { ContractException } from "./ContractException";
import { Contract, Config } from "./Contract";

export function create<T>(config?: Config<T> | null) : Contract<T> {
    return RatifiedContract.create<T>(config);
}

export function isRatifiedContract(instance: unknown): instance is RatifiedContract<unknown> {
    return RatifiedContract.isRatifiedContract(instance);
}

class RatifiedContract<T> implements Contract<T> {

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
    * Casts the given object to the return type for this Contract
    * This is used to make sure the value is a checked value and does not sneak passed during erasure
    *
    * @param value the value to cast
    * @return the checked value. Note: null is possible. The Promisor is allowed to return null
    * @throws ClassCastException iif the value can't be cast to the return type.
    */
    public cast(value: unknown | null | undefined): OptionalType<T> {
        if (this.tester(value)) {
            return this.caster(value) as OptionalType<T>;
        } else {
            throw new ClassCastException(`${this.toString()} cast failed.`);
        }
    }

    /**
     * @return the contract name
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Note: Do not rely on this being a java class name
     * Note: The actual class is never exposed and is by design.
     *
     * @return the type of deliverable for this contract.
     */
    public getTypeName(): string {
        return this.typeName;
    }

    /**
     * When replaceable a new binding can replace in an existing one
     * The default is false
     *
     * @return true if replaceable
     */
    public isReplaceable(): boolean {
        return this.replaceable;
    }

    /**
     * String representation of this Contract
     * Note: not intended to be parsed or relied on.
     * @returns a string representation of the contract
     */
    public toString(): string {
        return `Contract(id=${this.id}, name=${this.name}, type=${this.typeName})`;
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
        this.integrityCheck()
        const candidateConfig: Config<T> = config ?? {};
        this.replaceable = candidateConfig?.isReplaceable ?? false;
        this.name = candidateConfig?.name ?? "";
        this.typeName = candidateConfig?.typeName ?? "";
        this.tester = candidateConfig?.test ?? ((instance: unknown): instance is OptionalType<T> => true);
        this.caster = candidateConfig?.cast ?? ((instance: unknown) => instance);
        Object.freeze(this);
    }

    private static ID_GENERATOR: number = 1;
    static readonly #SECRET : symbol = Symbol("Contract");

    readonly #secret : symbol = RatifiedContract.#SECRET;
    private readonly id: number = RatifiedContract.ID_GENERATOR++;
    private readonly name: string;
    private readonly typeName: string;
    private readonly tester: (instance: unknown) => instance is OptionalType<T>;
    private readonly caster: (instance: unknown) => unknown;
    private readonly replaceable: boolean;
}