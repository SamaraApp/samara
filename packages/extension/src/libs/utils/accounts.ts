import { SamaraAccount, NetworkNames, SignerType } from "@samaraapp/types";
import PublicKeyRing from "../keyring/public-keyring";
import { getNetworkByName } from "./networks";

const getOtherSigners = (signers: SignerType[]): SignerType[] => {
  const otherSigners: SignerType[] = [];
  Object.values(SignerType).forEach((_signer) => {
    if (!signers.includes(_signer)) otherSigners.push(_signer);
  });
  return otherSigners;
};

export const getAccountsByNetworkName = async (
  networkName: NetworkNames
): Promise<SamaraAccount[]> => {
  const network = getNetworkByName(networkName);

  if (!network) return [];

  const keyring = new PublicKeyRing();
  const accounts = await keyring.getAccounts(network.signer);

  return accounts.filter((account) => {
    if (account.isHardware && account.HWOptions !== undefined) {
      if (account.HWOptions.networkName === NetworkNames.Radiant) {
        return account.HWOptions.networkName === networkName;
      }
    }

    return true;
  });
};

export { getOtherSigners };
