
import { Tools } from "./Test.tools.test";
import { Contracts } from "../api/Contracts";
import { validateContracts } from "../api/Validate";

describe('Validate contracts', () => {
    it('Working scenario', () => {
        Tools.withContracts((contracts: Contracts) => {
            validateContracts(contracts);
        });
    });
});