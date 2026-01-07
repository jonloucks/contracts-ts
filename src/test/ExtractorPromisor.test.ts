import assert from 'node:assert';

import { OptionalType, RequiredType, Transform } from "../api/Types";
import { Tools } from "./Test.tools.test";
import { Contracts } from "../api/Contracts";
import { Contract } from "../api/Contract";
import { Promisor, typeToPromisor  } from "../api/Promisor";
import { PromisorFactory, CONTRACT as PROMISORS_CONTRACT } from "../api/PromisorFactory";
import { createContract } from "../index";

describe('Extract Promisor tests', () => {

    it("", () => {
        const referent: CurrentDatePromisor = new CurrentDatePromisor();
        const converted : RequiredType<Promisor<Date>> = typeToPromisor<Date>(referent);
        assert.strictEqual(converted, referent, "Converted promisor should be the same as the original referent.");

        const transform : Transform<Date, string> = {
            transform: (date: RequiredType<Date>) : string => {
                return date?.toString();
            }
        };

        assert.notStrictEqual(transform.transform(new Date()), null, "Transform should not be null.");
        assert.notStrictEqual(transform.transform(new Date()), undefined, "Transform should not be undefined.");


        Tools.withContracts((contracts: Contracts) => {
            const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
            const contract: Contract<string> = createContract<string>();
            const promisor: Promisor<string> = promisorFactory.createExtractor<Date, string>(referent, transform);

            using usingPromisor = contracts.bind(contract, promisor);

            const claimeValue: OptionalType<string> = contracts.claim(contract);
            const claimeValue2: OptionalType<string> = contracts.claim(contract);

            assert.notStrictEqual(claimeValue, null, "First claim should not be null.");
            assert.notStrictEqual(claimeValue, undefined, "First claim should not be undefined.");
            assert.ok(typeof claimeValue === 'string', "First claimed value should be a string.");

            assert.notStrictEqual(claimeValue2, null, "Second claim should not be null.");
            assert.notStrictEqual(claimeValue2, undefined, "Second claim should not be undefined.");
            assert.ok(typeof claimeValue2 === 'string', "Second claimed value should be a string.");
        });
        assert.strictEqual(referent.usageCount, 0, "Referent usage count should be zero after use.");
        assert.strictEqual(referent.demandCount, 2, "Referent demand count should be two after use.");
    });
});

class CurrentDatePromisor implements Promisor<Date> {
    demand(): OptionalType<Date> {
        ++this.demandCount
        if (this.usageCount <= 0) {
            throw new Error("Usage count should be greater than zero.");
        }
        return new Date();
    }
    incrementUsage(): number {
        return ++this.usageCount;
    }
    decrementUsage(): number {
        const save = --this.usageCount;
        if (this.usageCount < 0) {
            throw new Error("Decemented too many times.");
        }
        return save;
    }
    usageCount: number = 0;
    demandCount: number = 0;
};

// @Test
// default void extractPromisor_NullReferent_Throws() {
//     withContracts(contracts -> {
//         final Promisors promisors = contracts.claim(Promisors.CONTRACT);

//         assertThrown(IllegalArgumentException.class,
//             () -> promisors.createExtractPromisor(null, t -> "xyz"));
//     });
// }

// @Test
// default void extractPromisor_NullRecast_Throws() {
//     withContracts(contracts -> {
//         final Promisors promisors = contracts.claim(Promisors.CONTRACT);

//         assertThrown(IllegalArgumentException.class,
//             () -> promisors.createExtractPromisor(() -> "abc", null));
//     });
// }

// @Test
// default void extractPromisor_Valid_Works(@Mock Promisor<Decoy<Integer>> referent, @Mock Decoy<Integer> deliverable) {
//     withContracts(contracts -> {
//         final int usages = 5;
//         final Promisors promisors = contracts.claim(Promisors.CONTRACT);
//         when(referent.demand()).thenReturn(deliverable);
//         final Promisor<String> promisor = promisors.createExtractPromisor(referent, c -> "abc");

//         assertNotNull(promisor, "should not return null.");

//         for (int i = 0; i < usages; i++) {
//             promisor.incrementUsage();
//         }
//         for (int i = 0; i < usages; i++) {
//             promisor.decrementUsage();
//         }

//         assertAll(
//             () -> assertSame("abc", promisor.demand(), "deliverables should match."),
//             () -> verify(referent, times(usages)).decrementUsage(),
//             () -> verify(referent, times(usages)).incrementUsage(),
//             () -> verify(deliverable, never()).incrementUsage(),
//             () -> verify(deliverable, never()).decrementUsage(),
//             () -> verify(deliverable, never()).open(),
//             () -> verify(deliverable, never()).close()
//         );
//     });
// }



