import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test";
import { used } from "../auxiliary/Checks";

describe('Contracts with partners', () => {

  it('when bound in both primary and partner, primary should use its own binding', () => {
    const contract: Contract<string> = Tools.createStringContract();
    Tools.withPartnerContracts((primary: Contracts, partner: Contracts) => {
      using closeBindPrimary: AutoClose = primary.bind(contract, () => "Primary");
      used(closeBindPrimary);
      using closeBindPartner: AutoClose = partner.bind(contract, () => "Partner");
      used(closeBindPartner);

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
      using closeBindPartner: AutoClose = partner.bind(contract, () => "Partner");
      used(closeBindPartner);
      Tools.assertTrue(primary.isBound(contract), "Primary should be bound due to partner binding");
      Tools.assertEquals("Partner", primary.claim(contract), "Primary should reflect partner binding");
    });
  });

  it('when bound only in primary, primary should reflect its own binding', () => {
    const contract: Contract<string> = Tools.createStringContract();
    Tools.withPartnerContracts((primary: Contracts, partner: Contracts) => {
      used(partner)
      using closeBindPrimary: AutoClose = primary.bind(contract, () => "Primary");
      used(closeBindPrimary);
      Tools.assertTrue(primary.isBound(contract), "Primary should be bound");
      Tools.assertEquals("Primary", primary.claim(contract), "Primary should reflect its own binding");
    });
  });
}); 