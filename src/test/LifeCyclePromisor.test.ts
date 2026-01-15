import { createContract, typeToPromisor, Promisor } from "contracts-ts";
import { AUTO_CLOSE_NONE, AutoClose } from "contracts-ts/api/AutoClose";
import { AutoOpen, isAutoOpen } from "contracts-ts/api/AutoOpen";
import { ClassCastException } from "contracts-ts/api/auxiliary/ClassCastException";
import { IllegalStateException } from "contracts-ts/api/auxiliary/IllegalStateException";
import { Contract } from "contracts-ts/api/Contract";
import { Contracts } from "contracts-ts/api/Contracts";
import { PromisorFactory, CONTRACT as PROMISORS_CONTRACT } from "contracts-ts/api/PromisorFactory";
import { Tools } from "contracts-ts/test/Test.tools.test";

describe('LifeCyclePromisor tests', () => {
  it("demand without incrementUsage throws", () => {
    Tools.withContracts((contracts: Contracts) => {
      const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
      const promisor: Promisor<number> = promisorFactory.createLifeCycle(typeToPromisor(34));

      expect(() => {
        promisor.demand();
      }).toThrow(IllegalStateException);
    });
  });
  it("open is called during demand", () => {
    Tools.withContracts((contracts: Contracts) => {
      const openMock: AutoOpen = jest.mocked<AutoOpen>({
        open: jest.fn(),
      });
      const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
      const sourcePromisor: Promisor<unknown> = promisorFactory.createValue(openMock);
      const promisor: Promisor<unknown> = promisorFactory.createLifeCycle(sourcePromisor);
      promisor.incrementUsage();
      promisor.demand();
      expect(openMock.open).toHaveBeenCalledTimes(1);
    });
  });
  it("when open throws is rethrown", () => {
    Tools.withContracts((contracts: Contracts) => {
      const expectedError: Error = new Error("Expected open failure.");
      const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
      const sourcePromisor: Promisor<ThrowsOnOpen> = promisorFactory.createValue(new ThrowsOnOpen(expectedError));
      const promisor: Promisor<ThrowsOnOpen> = promisorFactory.createLifeCycle(sourcePromisor);
      promisor.incrementUsage();
      expect(() => {
        promisor.demand();
      }).toThrow(expectedError);
    });
  });
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

class ThrowsOnOpen implements AutoOpen {
  constructor(error: unknown) {
    this.error = error;
  }
  open(): AutoClose {
    throw this.error;
  }

  private readonly error: unknown
}
