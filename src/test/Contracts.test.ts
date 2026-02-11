import { ok } from "assert/strict";
import { mock, MockProxy } from "jest-mock-extended";

import { createContract } from "@jonloucks/contracts-ts";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { Contracts, guard } from "@jonloucks/contracts-ts/api/Contracts";
import { Promisor } from "@jonloucks/contracts-ts/api/Promisor";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test.js";
import { assertGuard, mockGuardFix } from "@jonloucks/contracts-ts/test/helper.test.js";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

describe('guard tests', () => {
  it('guard should return true for Contracts', () => {
    const instance: MockProxy<Contracts> = mock<Contracts>();
    mockGuardFix(instance, 'claim', 'enforce', 'isBound', 'bind', 'open');
    ok(guard(instance), 'Contracts should return true');
  });
});

describe("Contracts Idempotent", () => {
  test("is idempotent", () => {
    Tools.withContracts((contracts) => {
      Tools.assertIdempotent(contracts.open());
    })
  });
});

describe("Contracts toString", () => {
  test("is not null or undefined", () => {
    Tools.withContracts((contracts) => {
      expect(String(contracts)).not.toBeNull();
      expect(String(contracts)).not.toBeUndefined();
    })
  });
});

describe("Bind same promisor", () => {
  test("is not null or undefined", () => {
    Tools.withContracts((contracts) => {
      const promisor = new class implements Promisor<string> {
        incrementUsage(): number {
          return 1;
        }
        decrementUsage(): number {
          return 1;
        }
        demand(): string {
          return "test";
        }
      };

      const contract = Tools.createStringContract();
      using closeBind1: AutoClose = contracts.bind(contract, promisor);
      used(closeBind1);
      using closeBind2: AutoClose = contracts.bind(contract, promisor);
      used(closeBind2);

      expect(contracts.enforce(contract)).toEqual("test");
    })
  });
});

describe("Bind with existing promisor", () => {
  test("contract is replaceable", () => {
    Tools.withContracts((contracts) => {
      const contract = createContract<string>({
        replaceable: true
      });
      using closeBind1: AutoClose = contracts.bind(contract, () => "original value");
      used(closeBind1);
      using closeBind2: AutoClose = contracts.bind(contract, () => "new value");
      used(closeBind2);
      expect(contracts.enforce(contract)).toEqual("new value");
    })
  });
  test("contract is not replaceable", () => {
    Tools.withContracts((contracts) => {
      const contract = createContract<string>({
        replaceable: false
      });
      using closeBind1: AutoClose = contracts.bind(contract, () => "original value");
      used(closeBind1);
      using closeBind2: AutoClose = contracts.bind(contract, () => "new value");
      used(closeBind2);
      expect(contracts.enforce(contract)).toEqual("original value");
    })
  });
  test("contract is not replaceable and strategy ALWAYS", () => {
    Tools.withContracts((contracts) => {
      const contract = createContract<string>({
        replaceable: false
      });
      using closeBind1: AutoClose = contracts.bind(contract, () => "original value");
      used(closeBind1);

      expect(() => {
        contracts.bind(contract, () => "new value", "ALWAYS");
      }).toThrow(ContractException);
    })
  });
  test("contract is replaceable and strategy ALWAYS", () => {
    Tools.withContracts((contracts) => {
      const contract = createContract<string>({
        replaceable: true
      });
      using closeBind1: AutoClose = contracts.bind(contract, () => "original value");
      used(closeBind1);
      using closeBind2: AutoClose = contracts.bind(contract, () => "new value", "ALWAYS");
      used(closeBind2);
      expect(contracts.enforce(contract)).toEqual("new value");
    })
  });
    test("contract is replaceable and strategy IF_NOT_BOUND", () => {
    Tools.withContracts((contracts) => {
      const contract = createContract<string>({
        replaceable: true
      });
      using closeBind1: AutoClose = contracts.bind(contract, () => "original value");
      used(closeBind1);
      using closeBind2: AutoClose = contracts.bind(contract, () => "new value", "IF_NOT_BOUND");
      used(closeBind2);
      expect(contracts.enforce(contract)).toEqual("original value");
    })
  });
});

describe("Contracts enforce", () => {
  test("with Promisor returning null", () => {
    Tools.withContracts((contracts) => {
      const contract = Tools.createStringContract();
      using closeBind: AutoClose = contracts.bind(contract, () => null);
      used(closeBind);

      expect(() => contracts.enforce(contract))
        .toThrow(ContractException);
    })
  });

  test("with Promisor returning undefined", () => {
    Tools.withContracts((contracts) => {
      const contract = Tools.createStringContract();
      using closeBind: AutoClose = contracts.bind(contract, () => undefined);
      used(closeBind);

      expect(() => contracts.enforce(contract))
        .toThrow(ContractException);
    })
  });
});

assertGuard(guard, "claim", "enforce", "isBound", "bind", "open");
