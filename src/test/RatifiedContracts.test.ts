import assert from 'assert';
import { Tools } from "./Test.tools.test";
import { PromisorType } from "../api/Promisor";
import { Contracts, Config as ContractsConfig } from "../api/Contracts";
import { createContract } from "../index";

describe('Constracts with ratified', () => {

    it('bind with unratified contract should throw ContractException', () => {
        const contractsConfig: ContractsConfig = { ratified: true };
        const contract = createContract<string>();
        const promisor: PromisorType<string> = () => "Hello World";
        Tools.withConfiguredContracts(contractsConfig, (contracts: Contracts) => {
            assert.throws(() => {
                contracts.bind(contract, promisor);
            }, {
                name: 'ContractException',
                message: /ratified/
            });
        });
    });

    it('isBound with unratified contract should throw ContractException', () => {
        const contractsConfig: ContractsConfig = { ratified: true };
        const contract = createContract<string>();
        Tools.withConfiguredContracts(contractsConfig, (contracts: Contracts) => {
            assert.throws(() => {
                contracts.isBound(contract);
            }, {
                name: 'ContractException',
                message: /ratified/
            });
        });
    });

    it('claim with unratified contract should throw ContractException', () => {
        const contractsConfig: ContractsConfig = { ratified: true };
        const contract = createContract<string>();
        Tools.withConfiguredContracts(contractsConfig, (contracts: Contracts) => {
            assert.throws(() => {
                contracts.claim(contract);
            }, {
                name: 'ContractException',
                message: /ratified/
            });
        });
    });

    it('enforce with unratified contract should throw ContractException', () => {
        const contractsConfig: ContractsConfig = { ratified: true };
        const contract = createContract<string>();
        Tools.withConfiguredContracts(contractsConfig, (contracts: Contracts) => {
            assert.throws(() => {
                contracts.enforce(contract);
            }, {
                name: 'ContractException',
                message: /ratified/
            });
        });
    });
});
