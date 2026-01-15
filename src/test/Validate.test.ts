import assert from "node:assert";

import { AutoClose } from "contracts-ts/api/AutoClose";
import { ContractException } from "contracts-ts/api/ContractException";
import { Contracts } from "contracts-ts/api/Contracts";
import { Promisor, typeToPromisor } from "contracts-ts/api/Promisor";
import { validateContracts } from "contracts-ts/api/auxiliary/Validate";
import { Tools } from "contracts-ts/test/Test.tools.test";

describe('Validate contracts', () => {
  it('Working scenario', () => {
    Tools.withContracts((contracts: Contracts) => {
      validateContracts(contracts);
    });
  });

  it('With null Contracts throws', () => {
    assert.throws(() => {
      validateContracts(null as unknown as Contracts);
    }, {
      name: "IllegalArgumentException",
      message: "Contracts must be present."
    });
  });

  it('validate_WhenBindReturnsFalse_Throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      jest.spyOn(contracts, 'isBound').mockReturnValue(false);
      assert.throws(() => {
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
      assert.throws(() => {
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
      assert.throws(() => {
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
        close: () => { },
        [Symbol.dispose]: function (): void {
        }
      });
      jest.spyOn(contracts, 'isBound').mockReturnValue(false);
      jest.spyOn(contracts, 'bind').mockImplementation(() => {
        return closeMock;
      });
      assert.throws(() => {
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
        close: () => { },
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

      assert.throws(() => {
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
        close: () => { },
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

      assert.throws(() => {
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
        close: () => { },
        [Symbol.dispose]: function (): void {
        }
      });
      jest.spyOn(contracts, 'isBound').mockReturnValueOnce(false);
      jest.spyOn(contracts, 'bind').mockImplementation((c, type, strategy) => {
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

      assert.throws(() => {
        validateContracts(contracts);
      }, {
        name: "ContractException",
        message: "Contract unbinding not working."
      });
    });
  });
});