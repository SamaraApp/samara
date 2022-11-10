import { BaseNetwork } from "@/types/base-network";
import { UTXO } from "@/types/base-token";
import { ToTokenData } from "@/ui/action/types/token";
import { SamaraAccount } from "@samaraapp/types";
import {
  FeeMarketEIP1559Transaction,
  Transaction as LegacyTransaction,
} from "@ethereumjs/tx";
import { GasPriceTypes } from "../libs/transaction/types";

export interface GasFeeInfo {
  nativeValue: string;
  fiatValue: string;
  nativeSymbol: string;
  fiatSymbol: string;
}
export interface GasFeeType {
  [GasPriceTypes.ECONOMY]: GasFeeInfo;
  [GasPriceTypes.REGULAR]: GasFeeInfo;
  [GasPriceTypes.FAST]: GasFeeInfo;
  [GasPriceTypes.FASTEST]: GasFeeInfo;
}

export interface SendTransactionDataType {
  chainId: `0x${string}`;
  from: `0x${string}`;
  value: number;
  to: `0x${string}`;
  data: `0x${string}`;
  utxos: UTXO[];
}
export interface VerifyTransactionParams {
  fromAddress: string;
  fromAddressName: string;
  toAddress: string;
  toToken: ToTokenData;
  gasFee: GasFeeInfo;
  gasPriceType: GasPriceTypes;
  TransactionData: SendTransactionDataType;
}

export interface SignerTransactionOptions {
  payload: FeeMarketEIP1559Transaction | LegacyTransaction;
  network: BaseNetwork;
  account: SamaraAccount;
}

export interface SignerMessageOptions {
  payload: Buffer;
  network: BaseNetwork;
  account: SamaraAccount;
}
