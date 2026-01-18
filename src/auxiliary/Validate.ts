import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { contractsCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

/**
* A simple runtime validation of deployed implementation
*
* @param contracts the contracts to check
*/
export function validateContracts(contracts: Contracts): void {
  const validContracts: Contracts = contractsCheck(contracts);
  try {
    const contract: Contract<Date> = createContract<Date>({
      test: (instance: unknown): instance is Date => { return instance instanceof Date; }
    });
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
    ContractException.rethrow(thrown, "Contracts unexpected validation error.");
  }
}
