import KeyRing from "@samaraapp/keyring";
import { InternalStorageNamespace } from "@/types/provider";
import BrowserStorage from "../common/browser-storage";
import {
  SamaraAccount,
  HWWalletAdd,
  KeyPairAdd,
  KeyRecordAdd,
  SignerType,
  SignOptions,
  WalletType,
} from "@samaraapp/types";
import RadiantSigner from "@/providers/radiant/libs/radiant-signer";

export class KeyRingBase {
  #keyring: KeyRing;
  constructor() {
    const browserStorage = new BrowserStorage(InternalStorageNamespace.keyring);
    this.#keyring = new KeyRing(browserStorage, new RadiantSigner());
  }
  init(mnemonic: string, password: string): Promise<void> {
    return this.#keyring.init(password, { mnemonic });
  }
  async reset(): Promise<void> {
    const resetPromises = Object.values(InternalStorageNamespace).map((name) =>
      new BrowserStorage(name).clear()
    );
    await Promise.all(resetPromises);
  }
  getNewAccount(options: {
    basePath: string;
    signerType: SignerType;
  }): Promise<SamaraAccount> {
    return this.#keyring.createKey({
      name: "",
      basePath: options.basePath,
      signerType: options.signerType,
      walletType: WalletType.mnemonic,
    });
  }
  saveNewAccount(options: KeyRecordAdd): Promise<SamaraAccount> {
    return this.#keyring.createAndSaveKey(options);
  }
  sign(hexMessage: `0x${string}`, options: SignOptions): Promise<any> {
    return this.#keyring.sign(hexMessage, options);
  }
  getEthereumEncryptionPublicKey(options: SignOptions): Promise<string> {
    return this.#keyring.getEthereumEncryptionPublicKey(options);
  }
  ethereumDecrypt(
    encryptedMessage: string,
    options: SignOptions
  ): Promise<string> {
    return this.#keyring.ethereumDecrypt(encryptedMessage, options);
  }
  getKeysArray(): Promise<SamaraAccount[]> {
    return this.#keyring.getKeysArray();
  }
  getKeysObject(): Promise<{ [key: string]: SamaraAccount }> {
    return this.#keyring.getKeysObject();
  }
  addHWAccount(account: HWWalletAdd): Promise<SamaraAccount> {
    return this.#keyring.addHWAccount(account);
  }
  addKeyPair(account: KeyPairAdd, password: string): Promise<SamaraAccount> {
    return this.#keyring.addKeyPair(account, password);
  }
  isLocked(): boolean {
    return this.#keyring.isLocked();
  }
  unlock(password: string): Promise<void> {
    return this.#keyring.unlockMnemonic(password);
  }
  lock(): void {
    return this.#keyring.lock();
  }
  getMnemonic(password: string): Promise<string> {
    return this.#keyring.getMnemonic(password);
  }
  isInitialized(): Promise<boolean> {
    return this.#keyring.isInitialized();
  }
  renameAccount(address: string, newName: string): Promise<SamaraAccount> {
    return this.#keyring.renameAccount(address, newName);
  }
  deleteAccount(address: string): Promise<void> {
    return this.#keyring.deleteAccount(address);
  }
}
export default KeyRingBase;
