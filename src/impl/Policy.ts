import { Contract } from "../api/Contract";

export { Contract} from "../api/Contract";

/**
 * Policy interface for checking contracts.
 */
export interface Policy {

    /**
     * Check the given contract if the policy accepts it.
     * @param contract the contract to check
     */
    checkContract<T>(contract: Contract<T>): void;
}