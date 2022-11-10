import { mnemonicToSeed } from "bip39";
import { SignerInterface, KeyPair } from "@samaraapp/types";
import HDkey from "hdkey";
import * as CoinKey from "coinkey";
import * as radiantjs from "@radiantblockchain/radiantjs";

class RadiantSigner implements SignerInterface {
  async generate(mnemonic: string, derivationPath = ""): Promise<KeyPair> {
    const seed = await mnemonicToSeed(mnemonic);
    const hdkey = HDkey.fromMasterSeed(seed);
    const key = hdkey.derive(derivationPath);
    const privateKey = key.privateKey.toString("hex");
    console.log("privateKey", privateKey);
    const publicKey = key.publicKey.toString("hex");
    console.log("publicKey", publicKey);
    const ck = new CoinKey(key.privateKey);
    console.log("RadiantSigner CoinKey", CoinKey);
    const address = ck.publicAddress;
    console.log("address", address);
 
    return {
      address: address,
      privateKey: privateKey,
      publicKey: publicKey,
    };
  }

  async verify(
    msgHash: string,
    sig: string,
    publicKey: string
  ): Promise<boolean> {
    return false;
  }

  async sign(tx: any, keyPair: KeyPair): Promise<any> {
    console.log("radiant signer sign", tx);
    const privateKey = new radiantjs.PrivateKey(keyPair.privateKey);
    console.log("radiant private Key", privateKey);

    const newCopy = new radiantjs.Transaction(tx);
    console.log("newcopy", newCopy);
    newCopy.sign(privateKey);
    console.log("signed tx", newCopy);
    const ret = newCopy.toString();
    console.log('ret', ret);
    return ret;
  }

  async getEncryptionPublicKey(keyPair: KeyPair): Promise<string> {
    return "";
  }

  async decrypt(encryptedDataStr: string, keyPair: KeyPair): Promise<string> {
    return "";
  }
}
export default RadiantSigner;
