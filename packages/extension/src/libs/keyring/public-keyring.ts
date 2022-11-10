import {
  SignerType,
  Errors,
  WalletType,
  SamaraAccount,
} from "@samaraapp/types";
import { assert } from "chai";
import { KeyRingBase } from "./keyring";
class PublicKeyRing {
  #keyring: KeyRingBase;
  constructor() {
    this.#keyring = new KeyRingBase();
  }
  private async getKeysObject(): Promise<{ [key: string]: SamaraAccount }> {
    const allKeys = await this.#keyring.getKeysObject();
    if (process.env.IS_DEV) {
      /*
      allKeys["1MLj6VUvonNFyp7NWKwPRCBtdmFB27haDE"] = {
        address: "1MLj6VUvonNFyp7NWKwPRCBtdmFB27haDE",
        basePath: "m/44'/60'/1'/0",
        name: "fake account #1",
        pathIndex: 0,
        publicKey: "0x0",
        signerType: SignerType.secp256k1,
        walletType: WalletType.mnemonic,
        isHardware: false,
      };
     
      allKeys["1HmXUXuzp8gvhE3SfxhsPVDqMdfU5mjTLk"] = {
        address: "1HmXUXuzp8gvhE3SfxhsPVDqMdfU5mjTLk",
        basePath: "m/44'/60'/1'/1",
        name: "fake ledger account #3",
        pathIndex: 0,
        publicKey: "0x0",
        signerType: SignerType.secp256k1,
        walletType: WalletType.ledger,
        isHardware: true,
      };
      allKeys["147BmFgPxj89Q4o7SoV6vbQfLouQeevzf3"] = {
        address: "147BmFgPxj89Q4o7SoV6vbQfLouQeevzf3",
        basePath: "//",
        name: "fake account #4",
        pathIndex: 0,
        publicKey: "0x0",
        signerType: SignerType.secp256k1,
        walletType: WalletType.mnemonic,
        isHardware: false,
      };*/
    }
    return allKeys;
  }
  async getAccounts(types?: SignerType[]): Promise<SamaraAccount[]> {
    return this.getKeysObject().then((keysObject) => {
      const records = Object.values(keysObject);
      return types
        ? records.filter((r) => types.includes(r.signerType))
        : records;
    });
  }
  async getAccount(address: string): Promise<SamaraAccount> {
    const allKeys = await this.getKeysObject();
    assert(allKeys[address], Errors.KeyringErrors.AddressDoesntExists);
    return allKeys[address];
  }
  isLocked(): boolean {
    return this.#keyring.isLocked();
  }
  isInitialized(): Promise<boolean> {
    return this.#keyring.isInitialized();
  }
  async accountAlreadyAdded(newAddress: string): Promise<boolean> {
    newAddress = newAddress.toLowerCase();

    const allAccounts = await this.getAccounts();

    let alreadyExists = false;

    for (const account of allAccounts) {
      if (account.address.toLowerCase() === newAddress) {
        alreadyExists = true;
        break;
      }
    }

    return alreadyExists;
  }
}
export default PublicKeyRing;
