import { describe, test, it } from "node:test";
import { ok } from "assert/strict";
import assert, { throws } from "node:assert";

import { createContract } from "@jonloucks/contracts-ts";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { Contracts, guard } from "@jonloucks/contracts-ts/api/Contracts";
import { Promisor } from "@jonloucks/contracts-ts/api/Promisor";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test.js";
import { assertGuard } from "@jonloucks/contracts-ts/test/helper.test.js";
import { BindStrategyType } from "@jonloucks/contracts-ts/api/BindStrategy";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { PromisorType } from "@jonloucks/contracts-ts/api/Promisor";
import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";

describe('guard tests', () => {
  it('guard should return true for Contracts', () => {
    const instance: Contracts = {
      claim: function <T>(contract: Contract<T>): OptionalType<T> {
        used(contract);
        throw new Error("Function not implemented.");
      },
      enforce: function <T>(contract: Contract<T>): RequiredType<T> {
        used(contract);
        throw new Error("Function not implemented.");
      },
      isBound: function <T>(contract: Contract<T>): boolean {
                used(contract);
        throw new Error("Function not implemented.");
      },
      bind: function <T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategyType): AutoClose {
        used(contract);
        used(promisor);
        used(bindStrategy);
        throw new Error("Function not implemented.");
      },
      open: function (): AutoClose {
        throw new Error("Function not implemented.");
      }
    };
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
      assert(String(contracts) !== null);
      assert(String(contracts) !== undefined);
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

      assert.deepStrictEqual(contracts.enforce(contract), "test");
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
      assert.deepStrictEqual(contracts.enforce(contract), "new value");
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
      assert.deepStrictEqual(contracts.enforce(contract), "original value");
    })
  });
  test("contract is not replaceable and strategy ALWAYS", () => {
    Tools.withContracts((contracts) => {
      const contract = createContract<string>({
        replaceable: false
      });
      using closeBind1: AutoClose = contracts.bind(contract, () => "original value");
      used(closeBind1);

      assert.throws(() => {
        contracts.bind(contract, () => "new value", "ALWAYS");
      }, ContractException);
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
      assert.deepStrictEqual(contracts.enforce(contract), "new value");
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
      assert.deepStrictEqual(contracts.enforce(contract), "original value");
    })
  });
});

describe("Contracts enforce", () => {
  test("with Promisor returning null", () => {
    Tools.withContracts((contracts) => {
      const contract = Tools.createStringContract();
      using closeBind: AutoClose = contracts.bind(contract, () => null);
      used(closeBind);

      throws(() => contracts.enforce(contract), ContractException);
    })
  });

  test("with Promisor returning undefined", () => {
    Tools.withContracts((contracts) => {
      const contract = Tools.createStringContract();
      using closeBind: AutoClose = contracts.bind(contract, () => undefined);
      used(closeBind);

      throws(() => contracts.enforce(contract), ContractException);
    })
  });
});

assertGuard(guard, "claim", "enforce", "isBound", "bind", "open");
