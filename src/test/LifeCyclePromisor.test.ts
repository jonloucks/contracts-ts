import { createContract } from "contracts-ts";
import { AUTO_CLOSE_NONE, AutoClose } from "contracts-ts/api/AutoClose";
import { AutoOpen, isAutoOpen } from "contracts-ts/api/AutoOpen";
import { ClassCastException } from "contracts-ts/api/auxiliary/ClassCastException";
import { Contract } from "contracts-ts/api/Contract";
import { Contracts } from "contracts-ts/api/Contracts";
import { PromisorFactory, CONTRACT as PROMISORS_CONTRACT } from "contracts-ts/api/PromisorFactory";
import { Tools } from "contracts-ts/test/Test.tools.test";

describe('LifeCyclePromisor tests', () => {
  it('Reentrancy failure: Issue #69', () => {
    Tools.withContracts((contracts: Contracts) => {
      const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
      let openCounter: number = 0;
      const contract: Contract<AutoOpen> = createContract<AutoOpen>({
        name: "ReentrancyPromisor",
        typeName: "AutoOpen",
        cast: (obj: unknown): AutoOpen => {
          if (isAutoOpen(obj)) {
            return obj as AutoOpen;
          }
          throw new ClassCastException("Cannot cast to AutoOpen.");
        },
        replaceable: false
      });
      class ReentrancyPromisor implements AutoOpen {
        open(): AutoClose {
          if (++openCounter > 1) {
            throw new Error("Reentrancy failure: Issue #69");
          }
          contracts.enforce(contract);
          return AUTO_CLOSE_NONE;
        }
      };

      using _usingPromisor = contracts.bind(contract, promisorFactory.createLifeCycle(ReentrancyPromisor));
      contracts.enforce(contract);
    });
  });
});
