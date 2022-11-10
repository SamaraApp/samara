import * as bs58check from "bs58check";
import { sha256 } from "js-sha256";
import * as radiantjs from "@radiantblockchain/radiantjs";
import * as coinselect from "bsv-coinselect";

export function toValidatedAddress(address: string) {
  return address;
}

export function addressToScripthash(address: string): string {
  const p2pkh = addressToP2PKH(address);
  const p2pkhBuf = Buffer.from(p2pkh, "hex");
  return Buffer.from(sha256(p2pkhBuf), "hex").reverse().toString("hex");
}

export function addressToP2PKH(address: string): string {
  const addressDecoded = bs58check.decode(address);
  const addressDecodedSub = addressDecoded.toString("hex").substr(2);
  const p2pkh = `76a914${addressDecodedSub}88ac`;
  return p2pkh;
}

export function addressToHash160(address: string): string {
  const addressDecoded = bs58check.decode(address);
  const addressDecodedSub = addressDecoded.toString("hex").substr(2);
  return addressDecodedSub;
}
export function hash160BufToAddress(hash160: Buffer): string {
  const addressEncoded = bs58check.encode(hash160);
  return addressEncoded;
}
export function hash160HexToAddress(hash160: string): string {
  const addressEncoded = bs58check.encode(Buffer.from(hash160, "hex"));
  return addressEncoded;
}

export interface ConstructTxResult {
  tx: any;
  fee: number;
  inputs: any[];
  outputs: any[];
}

export function getTransactionFeeEstimation(
  utxos: any[],
  from: string,
  to: string,
  value: any
): number {
  const unwrappedUtxos = [];
  for (const item of utxos.values()) {
    unwrappedUtxos.push({
      txid: item.txid,
      outputIndex: item.outputIndex,
      vout: item.outputIndex,
      script: item.script,
      value: item.value,
      satoshis: item.value,
      scriptPubKey: item.script,
    });
  }
  const options = {};
  const satsVal = Number(value);
  const targets = [
    {
      script: addressToP2PKH(to),
      value: satsVal,
    },
  ];
  const feeRate = 1100;
  const changeScript = addressToP2PKH(from);
  const coinResult = coinselect(
    unwrappedUtxos,
    targets,
    feeRate,
    changeScript,
    options
  );
  console.log("getTransactionFeeEstimation", coinResult);
  return coinResult.fee;
}

export function constructTransaction(
  utxos: any[],
  from: string,
  to: string,
  value: any
): ConstructTxResult {
  const unwrappedUtxos = [];
  for (const item of utxos.values()) {
    unwrappedUtxos.push({
      txid: item.txid,
      outputIndex: item.outputIndex,
      vout: item.outputIndex,
      script: item.script,
      value: item.value,
      satoshis: item.value,
      scriptPubKey: item.script,
    });
  }
  const options = {};
  const satsVal = Number(value);
  const targets = [
    {
      script: addressToP2PKH(to),
      value: satsVal,
    },
  ];
  console.log("constructTransaction", unwrappedUtxos, satsVal, to, targets);
  const feeRate = 1100;
  const changeScript = addressToP2PKH(from);
  const coinResult = coinselect(
    unwrappedUtxos,
    targets,
    feeRate,
    changeScript,
    options
  );
  console.log("constructTransaction coinResult", coinResult);
  const tx = new radiantjs.Transaction().from(coinResult.inputs);
  // Attach each output
  coinResult.outputs.forEach((output: any) => {
    const script = new radiantjs.Script(output.script).toString();
    tx.addOutput(
      new radiantjs.Transaction.Output({
        script: script,
        satoshis: output.value,
      })
    );
  });
  return {
    tx,
    fee: coinResult.fee,
    inputs: coinResult.inputs,
    outputs: coinResult.outputs,
  };
}
