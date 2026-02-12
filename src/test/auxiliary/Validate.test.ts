import { describe, it, mock } from "node:test";
import { throws } from "node:assert";

import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { validateContracts } from "@jonloucks/contracts-ts/auxiliary/Validate";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test.js";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose.js";
import { BindStrategy, Promisor } from "@jonloucks/contracts-ts";

describe('Validate contracts', () => {
  it('Working scenario', () => {
    Tools.withContracts((contracts: Contracts) => {
      validateContracts(contracts);
    });
  });

  it('validate_WhenBindReturnsFalse_Throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const mockIsBoundFn = mock.fn(<T>(contract: Contract<T>): boolean => {
        used(contract);
        return false;
      });
      contracts.isBound = mockIsBoundFn;

      throws(() => {
        validateContracts(contracts);
      }, {
        name: "ContractException",
        message: "Contract should have been bound."
      });
    });
  });
  it('validate_WithFirstIsBoundIsTrue_Throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const mockIsBoundFn = mock.fn(<T>(contract: Contract<T>): boolean => {
        used(contract);
        return true;
      });
      contracts.isBound = mockIsBoundFn;

      throws(() => {
        validateContracts(contracts);
      }, {
        name: "ContractException",
        message: "Contract should not be bound."
      });
    });
  });
  it('validate_bind_ReturnsNull_Throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const mockBindFn = mock.fn(<T>(contract: Contract<T>, promisor: Promisor<T>, bindStrategy?: BindStrategy): AutoClose => {
        used(contract);
        used(promisor);
        used(bindStrategy);
        return null as unknown as AutoClose;
      });
      contracts.bind = mockBindFn;
      throws(() => {
        validateContracts(contracts);
      }, {
        name: "ContractException",
        message: "Contract bind returned null."
      });
    });
  });

  it('validate_claim_AfterBind_ReturnsUnexpected_Throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const mockClaimFn = mock.fn(<T>(contract: Contract<T>): T => {
        used(contract);
        return null as unknown as T;
      });
      contracts.claim = mockClaimFn;

      throws(() => {
        validateContracts(contracts);
      }, {
        name: "ContractException",
        message: "Contract claiming not working."
      });
    });
  });

  it('validate_claim_AfterBind_ThrowsUnexpected_Throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const mockClaimFn = mock.fn(<T>(contract: Contract<T>): T => {
        used(contract);
        throw new Error("Math overflow.");
      });
      contracts.claim = mockClaimFn;

      throws(() => {
        validateContracts(contracts);
      }, {
        name: "ContractException",
        message: "Contracts unexpected validation error."
      });
    });
  });
  // 
  //   it('validate_AfterUnbindContractIsStillBound_Throws', () => {
  //     Tools.withContracts((contracts: Contracts) => {
  //       let capturePromisor: Promisor<unknown> | null = null;
  // //       const closeMock = jest.mocked<AutoClose>({
  //         close: () : void => { },
  //         [Symbol.dispose]: function (): void {
  //         }
  //       });
  // //       jest.spyOn(contracts, 'isBound').mockReturnValueOnce(false);
  // //       jest.spyOn(contracts, 'bind').mockImplementation((c, type, s) => {
  //         used(c);
  //         used(s);
  //         capturePromisor = typeToPromisor(type);
  //         return closeMock;
  //       });
  // //       jest.spyOn(contracts, 'isBound').mockReturnValue(true);
  // 
  // //       jest.spyOn(contracts, 'claim').mockImplementation(() => {
  //         if (null === capturePromisor) {
  //           throw new ContractException("Testing error: Promisor not captured.");
  //         }
  //         return capturePromisor.demand();
  //       });
  // 
  //       throws(() => {
  //         validateContracts(contracts);
  //       }, {
  //         name: "ContractException",
  //         message: "Contract unbinding not working."
  //       });
  //     });
  //   });
});