import KeyRing from "@/libs/keyring/keyring";
import RadiantNetworks from "@/providers/radiant/networks";
import { WalletType, SignerType } from "@samaraapp/types";
export default async (mnemonic: string, password: string): Promise<void> => {
  const kr = new KeyRing();
  await kr.init(mnemonic, password);
  await kr.unlock(password);
  const i = RadiantNetworks.radiant.signer[0];
  await kr.saveNewAccount({
    basePath: "m/44'/0'/0'/0", // EthereumNetworks.ethereum.basePath,
    name: "RXD Account 1",
    signerType: SignerType.secp256k1, //EthereumNetworks.ethereum.signer[0],
    walletType: WalletType.mnemonic,
  });
};
