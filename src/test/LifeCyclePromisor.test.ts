import { Tools } from "./Test.tools.test";
import { Contracts } from "../api/Contracts";
import { Contract } from "../api/Contract";
import { AutoOpen, isAutoOpen } from "../api/AutoOpen";
import { AutoClose, AUTO_CLOSE_NONE } from "..//api/AutoClose";
import { PromisorFactory, CONTRACT as PROMISORS_CONTRACT } from "../api/PromisorFactory";
import { AtomicInteger } from "../api/AtomicInteger";
import { CONTRACT as ATOMIC_INTEGER_FACTORY } from "../api/AtomicIntegerFactory";
import { ClassCastException } from "../api/ClassCastException";
import { createContract } from "../index";

describe('LifeCyclePromisor tests', () => {
    it('Reentrancy failure: Issue #69', () => {
        Tools.withContracts((contracts: Contracts) => {
            const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
            const openCounter: AtomicInteger = contracts.enforce(ATOMIC_INTEGER_FACTORY).create();
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
                    if (openCounter.incrementAndGet() > 1) {
                        throw new Error("Reentrancy failure: Issue #69");
                    }
                    contracts.enforce(contract);
                    return AUTO_CLOSE_NONE;
                }
            };

            using usingPromisor = contracts.bind(contract, promisorFactory.createLifeCycle(ReentrancyPromisor));
            contracts.enforce(contract);
        });
    });
});
