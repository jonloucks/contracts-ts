import { contractsCheck } from "./Checks";
import { AutoClose } from "./AutoClose";
import { Contract } from "./Contract";
import { ContractException } from "./ContractException";
import { Contracts } from "./Contracts";

/**
* A simple runtime validation of deployed implementation
*
* @param contracts the contracts to check
*/
export function validateContracts(contracts: Contracts): void {
    const validContracts: Contracts = contractsCheck(contracts);
    try {
        const contract: Contract<Date> = Contract.create<Date>({ });
        const deliverableValue: Date = new Date();

        if (validContracts.isBound(contract)) {
            throw new ContractException("Contract should not be bound.");
        }
        {
            using bindReturn: AutoClose = validContracts.bind(contract, () => deliverableValue);

            if (null === bindReturn || bindReturn === undefined) {
                throw new ContractException("Contract bind returned null.");
            }

            if (!validContracts.isBound(contract)) {
                throw new ContractException("Contract should have been bound.");
            }
            if (deliverableValue !== validContracts.claim(contract)) {
                throw new ContractException("Contract claiming not working.");
            }
        }

        if (validContracts.isBound(contract)) {
            throw new ContractException("Contract unbinding not working.");
        }
    } catch (thrown: unknown) {
        ContractException.rethrow(thrown, "Contracts validation failed.");
    }
}
