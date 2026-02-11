import { throws } from "node:assert";

import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Promisor, typeToPromisor } from "@jonloucks/contracts-ts/api/Promisor";
import { validateContracts } from "@jonloucks/contracts-ts/auxiliary/Validate";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test.js";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

describe('Validate contracts', () => {
  it('Working scenario', () => {
    Tools.withContracts((contracts: Contracts) => {
      validateContracts(contracts);
    });
  });

  it('validate_WhenBindReturnsFalse_Throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      jest.spyOn(contracts, 'isBound').mockReturnValue(false);
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
      jest.spyOn(contracts, 'isBound').mockReturnValue(true);
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
      jest.spyOn(contracts, 'isBound').mockReturnValue(false);
      jest.spyOn(contracts, 'bind').mockImplementation(() => {
        return null as unknown as AutoClose;
      });
      throws(() => {
        validateContracts(contracts);
      }, {
        name: "ContractException",
        message: "Contract bind returned null."
      });
    });
  });
  it('validate_isBound_AfterBind_ReturnsFalse_Throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const closeMock = jest.mocked<AutoClose>({
        close: () : void => { },
        [Symbol.dispose]: function (): void {
        }
      });
      jest.spyOn(contracts, 'isBound').mockReturnValue(false);
      jest.spyOn(contracts, 'bind').mockImplementation(() => {
        return closeMock;
      });
      throws(() => {
        validateContracts(contracts);
      }, {
        name: "ContractException",
        message: "Contract should have been bound."
      });
    });
  });
  it('validate_claim_AfterBind_ReturnsUnexpected_Throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const closeMock = jest.mocked<AutoClose>({
        close: () : void => { },
        [Symbol.dispose]: function (): void {
        }
      });
      jest.spyOn(contracts, 'isBound').mockReturnValueOnce(false);
      jest.spyOn(contracts, 'bind').mockImplementation(() => {
        return closeMock;
      });
      jest.spyOn(contracts, 'isBound').mockReturnValueOnce(true);
      jest.spyOn(contracts, 'claim').mockImplementation(() => {
        return null;
      });

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
      const closeMock = jest.mocked<AutoClose>({
        close: () : void => { },
        [Symbol.dispose]: function (): void {
        }
      });
      jest.spyOn(contracts, 'isBound').mockReturnValueOnce(false);
      jest.spyOn(contracts, 'bind').mockImplementation(() => {
        return closeMock;
      });
      jest.spyOn(contracts, 'isBound').mockReturnValueOnce(true);

      jest.spyOn(contracts, 'claim').mockImplementation(() => {
        throw new Error("Math overflow.");
      });

      throws(() => {
        validateContracts(contracts);
      }, {
        name: "ContractException",
        message: "Contracts unexpected validation error."
      });
    });
  });

  it('validate_AfterUnbindContractIsStillBound_Throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      let capturePromisor: Promisor<unknown> | null = null;
      const closeMock = jest.mocked<AutoClose>({
        close: () : void => { },
        [Symbol.dispose]: function (): void {
        }
      });
      jest.spyOn(contracts, 'isBound').mockReturnValueOnce(false);
      jest.spyOn(contracts, 'bind').mockImplementation((c, type, s) => {
        used(c);
        used(s);
        capturePromisor = typeToPromisor(type);
        return closeMock;
      });
      jest.spyOn(contracts, 'isBound').mockReturnValue(true);

      jest.spyOn(contracts, 'claim').mockImplementation(() => {
        if (null === capturePromisor) {
          throw new ContractException("Testing error: Promisor not captured.");
        }
        return capturePromisor.demand();
      });

      throws(() => {
        validateContracts(contracts);
      }, {
        name: "ContractException",
        message: "Contract unbinding not working."
      });
    });
  });
});