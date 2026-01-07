import { OptionalType } from "./Types";
import { ClassCastException } from "./ClassCastException";
import { Contract, Config } from "./Contract";

export function create<T>(config?: Config<T> | null) : Contract<T> {
    return BasicContract.create<T>(config);
}
``
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
    * @throws ClassCastException iif the value can't be cast to the return type.
    */
    public cast(value: unknown | null | undefined): OptionalType<T> {
        if (this._tester(value)) {
            return this._caster(value) as OptionalType<T>;
        } else {
            throw new ClassCastException(`${this.toString()} cast failed.`);
        }
    }

    /**
     * @return the contract name
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Note: Do not rely on this being a java class name
     * Note: The actual class is never exposed and is by design.
     *
     * @return the type of deliverable for this contract.
     */
    public get typeName(): string {
        return this._typeName;
    }

    /**
     * When replaceable a new binding can replace in an existing one
     * The default is false
     *
     * @return true if replaceable
     */
    public get replaceable(): boolean {
        return this._replaceable;
    }

    /**
     * String representation of this Contract
     * Note: not intended to be parsed or relied on.
     * @returns a string representation of the contract
     */
    public toString(): string {
        return `Contract(id=${this._id}, name=${this.name}, type=${this.typeName})`;
    }

    public constructor(config?: Config<T> | null) {
        const candidateConfig: Config<T> = config ?? {};
        this._replaceable = candidateConfig?.replaceable ?? false;
        this._name = candidateConfig?.name ?? "";
        this._typeName = candidateConfig?.typeName ?? "";
        this._tester = candidateConfig?.test ?? ((instance: unknown): instance is OptionalType<T> => true);
        this._caster = candidateConfig?.cast ?? ((instance: unknown) => instance);
    }

    private static ID_GENERATOR: number = 1;

    private readonly _id: number = BasicContract.ID_GENERATOR++;
    private readonly _name: string;
    private readonly _typeName: string;
    private readonly _tester: (instance: unknown) => instance is OptionalType<T>;
    private readonly _caster: (instance: unknown) => unknown;
    private readonly _replaceable: boolean;
}