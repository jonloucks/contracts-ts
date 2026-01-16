import { AutoClose } from "contracts-ts/api/AutoClose";
import { Contract } from "contracts-ts/api/Contract";
import { ContractException } from "contracts-ts/api/ContractException";
import { Contracts } from "contracts-ts/api/Contracts";
import { Tools } from "contracts-ts/test/Test.tools.test";

describe('Contracts with partners', () => {

  it('when bound in both primary and partner, primary should use its own binding', () => {
    const contract: Contract<string> = Tools.createStringContract();
    Tools.withPartnerContracts((primary: Contracts, partner: Contracts) => {
      using _: AutoClose = primary.bind(contract, () => "Primary");
      using __: AutoClose = partner.bind(contract, () => "Partner");

      Tools.assertEquals("Primary", primary.claim(contract), "Primary should reflect its own binding");
    });
  });

  it('when not bound in either primary or partner, neither should claim', () => {
    const contract: Contract<string> = Tools.createStringContract();
    Tools.withPartnerContracts((primary: Contracts, partner: Contracts) => {
      Tools.assertFalse(primary.isBound(contract), "Primary should not be bound");
      Tools.assertThrown(Tools.assertThrows(ContractException, () => primary.claim(contract)));
      Tools.assertFalse(partner.isBound(contract), "Partner should not be bound");
      Tools.assertThrown(Tools.assertThrows(ContractException, () => partner.claim(contract)));
    });
  });

  it('when bound only in partner, primary should reflect partner binding', () => {
    const contract: Contract<string> = Tools.createStringContract();
    Tools.withPartnerContracts((primary: Contracts, partner: Contracts) => {
      using _usingPartnerBind: AutoClose = partner.bind(contract, () => "Partner");

      Tools.assertTrue(primary.isBound(contract), "Primary should be bound due to partner binding");
      Tools.assertEquals("Partner", primary.claim(contract), "Primary should reflect partner binding");
    });
  });

  it('when bound only in primary, primary should reflect its own binding', () => {
    const contract: Contract<string> = Tools.createStringContract();
    Tools.withPartnerContracts((primary: Contracts, _partner: Contracts) => {
      using _usingPrimaryBind: AutoClose = primary.bind(contract, () => "Primary");

      Tools.assertTrue(primary.isBound(contract), "Primary should be bound");
      Tools.assertEquals("Primary", primary.claim(contract), "Primary should reflect its own binding");
    });
  });
}); 