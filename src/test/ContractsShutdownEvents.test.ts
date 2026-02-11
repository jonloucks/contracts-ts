import { Contracts, Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
import { OptionalType } from "@jonloucks/contracts-ts/api/Types";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test.js";
import { strictEqual } from "node:assert";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

describe('Contracts with shutdown events', () => {

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetModules();
  });

  const testEventNames: string[] = ['green', 'blue'];
  const config = { shutdownEvents: testEventNames };
  testEventNames.forEach((eventName) => {
    it(`with shutdownEvents configured should listen for event ${eventName}`, () => {
      assertListeningForEvent(config, eventName);
      assertEventTriggersShutdown(config, eventName);
    });
  });
});

function assertListeningForEvent(config: OptionalType<ContractsConfig>, eventName: string): void {
  const spyOn = jest.spyOn(process, 'on');
  const spyOff = jest.spyOn(process, 'off');
  try {
    Tools.withConfiguredContracts(config, (contracts: Contracts) => {
      used(contracts);
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
      used(bindContract);
      process.emit(eventName);
      expect(spyOn).toHaveBeenCalledWith(eventName, expect.any(Function));
      strictEqual(contracts.isBound(contract), false, 'Expected contract to be unbound after shutdown event');
    });
  } finally {
    spyOn.mockRestore();
    spyOff.mockRestore();
  }
}