import assert from "assert";
import { OptionalType } from "../api/Types";
import { Tools } from "./Test.tools.test";
import { Contracts, Config as ContractsConfig } from "../api/Contracts";


describe('Contracts with autoShutdown', () => {

    beforeEach(() => {
        jest.resetModules();
    });

    afterEach(() => {
        jest.resetModules();
    });

    const validEventNames: string[] = ['contracts-ts:shutdown', 'SIGINT', 'SIGTERM'];

    validEventNames.forEach((eventName) => {
        it(`with autoShutdown enabled should listen for event ${eventName} `, () => {
            assertListeningForEvent({ autoShutdown: true }, eventName);
            assertEventTriggersShutdown({ autoShutdown: true }, eventName);
        });
    });
});

function assertListeningForEvent(config: OptionalType<ContractsConfig>, eventName: string): void {
    const spyOn = jest.spyOn(process, 'on');
    const spyOff = jest.spyOn(process, 'off');
    try {
        Tools.withConfiguredContracts(config, (contracts: Contracts) => {
            expect(spyOn).toHaveBeenCalledWith(eventName, expect.any(Function));
        });
        expect(spyOff).toHaveBeenCalledWith(eventName, expect.any(Function));

    } finally {
        spyOn.mockRestore();
        spyOff.mockRestore();
    }
}

function assertEventTriggersShutdown(config: OptionalType<ContractsConfig>, eventName: string): void {
    const spyOn = jest.spyOn(process, 'on');
    const spyOff = jest.spyOn(process, 'off');
    try {
        Tools.withConfiguredContracts(config, (contracts: Contracts) => {
            const contract = Tools.createStringContract();
            using bindContract = contracts.bind<string>(contract, () => "test");
            process.emit(eventName);
            expect(spyOn).toHaveBeenCalledWith(eventName, expect.any(Function));
            assert.strictEqual(contracts.isBound(contract), false, 'Expected contract to be unbound after shutdown event');
        });
    } finally {
        spyOn.mockRestore();
        spyOff.mockRestore();
    }
}