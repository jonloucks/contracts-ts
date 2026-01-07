import { isNullOrUndefined, OptionalType } from "./Types";
import { ClassCastException } from "./ClassCastException";
import { ContractException } from "./ContractException";

/**
 * Configuration for a Contract
 * 
 * @param <T> The Contract deliverable type
 */
export interface Config<T> {

    /**
     * Ensure an instance is of type T (or descendant)
     *
     * @param instance the value to cast to type T
     * @return the value, null is allowed
     * @throws ClassCastException when type of instance is not correct
     */
    cast?: (instance: any) => OptionalType<T>;

    /**
     * the predefine test to check if instance is of type T
     * @param instance the instance to check
     * @returns 
     */
    test?: (instance: any) => instance is OptionalType<T>;

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
    isReplaceable?: boolean;
}

/**
 * A Contract defines a deliverable type by name and type.
 * Note: This is a final class and should not be extended!
 * @param <T> the type of deliverable for this Contract
 */
export class Contract<T> {

    /**
      * Create a contract derived from the given configuration
      *
      * @param config the name for the contract, null is not allowed
      * @param <T>    the type of deliverable for this Contract
      * @return the new Contract
      */
    public static create<T>(config?: Config<T>): Contract<T> {
        return new Contract<T>(config);
    }

    /**
    * Casts the given object to the return type for this Contract
    * This is used to make sure the value is a checked value and does not sneak passed during erasure
    *
    * @param value the value to cast
    * @return the checked value. Note: null is possible. The Promisor is allowed to return null
    * @throws ClassCastException iif the value can't be cast to the return type.
    */
    public cast(value: any | null | undefined): OptionalType<T> {
        if (this.tester(value)) {
            return this.caster(value);
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
     * Duck-typing check for Contract interface.
     * 
     * @param instance the instance to check
     * @returns true if the instance is a Contract, false otherwise
     */
    static isContract<T>(instance: any): instance is Contract<T> {
        if (isNullOrUndefined(instance)) {
            return true;
        }
        if (instance instanceof Contract) {
            instance.integrityCheck();
            return true;
        }
        return false;
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            if (this.#secret !== Contract.#SECRET) {
                throw new Error("Identifier  mismatch.");
            }
        } catch (thrown) {
            throw new ContractException('Security violation detected. This is not permitted.');
        }
    }

    private constructor(config?: Config<T>) {
        this.integrityCheck()
        const candidateConfig: Config<T> = config ?? {};
        this.replaceable = candidateConfig?.isReplaceable ?? false;
        this.name = candidateConfig?.name ?? "";
        this.typeName = candidateConfig?.typeName ?? "";
        this.tester = candidateConfig?.test ?? ((instance: any): instance is OptionalType<T> => true);
        this.caster = candidateConfig?.cast ?? ((instance: any): OptionalType<T> => instance);
        Object.freeze(this);
    }

    private static ID_GENERATOR: number = 1;
    static readonly #SECRET : symbol = Symbol("Contract");

    readonly #secret : symbol = Contract.#SECRET;
    private readonly id: number = Contract.ID_GENERATOR++;
    private readonly name: string;
    private readonly typeName: string;
    private readonly tester: (instance: any) => instance is OptionalType<T>;
    private readonly caster: (instance: any) => OptionalType<T>;
    private readonly replaceable: boolean;
}



