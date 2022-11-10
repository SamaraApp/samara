import { NetworkNames } from "@samaraapp/types";
import { BaseTokenOptions } from "./base-token";

interface EthereumRawInfo {
  blockHash: string;
  blockNumber: string;
  contractAddress: string | null;
  effectiveGasPrice: string;
  from: string;
  to: string | null;
  gas: string;
  gasUsed: string;
  status: boolean;
  transactionHash: string;
  data: string;
  nonce: string;
  value: string;
  timestamp: number | undefined;
}

interface TransactionHistoryItem {
  txid: string;
  tx_hash: string;
  height: number;

  // Note used:
  network: NetworkNames;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  isIncoming: boolean;
  transactionHash: string;
  token: BaseTokenOptions;
  status: ActivityStatus;
  type: ActivityType;
  swapId?: string;
  rawInfo?: EthereumRawInfo | SubscanExtrinsicInfo;
}

interface TransactionRawInfo {
  blockhash: string;
  blocktime?: number;
  confirmations?: number;
  hash: string;
  locktime: number;
  size: number;
  time?: number;
  txid: string;
  version: number;
  vin: any[];
  vout: any[];
}

interface SubscanExtrinsicInfo {
  success: boolean;
  finalized: boolean;
  pending: boolean;
  extrinsic_hash: string;
  call_module: string;
  block_timestamp: number;
  block_num: number;
}

enum ActivityStatus {
  pending = "pending",
  success = "success",
  failed = "failed",
}

enum ActivityType {
  transaction = "transaction",
}

interface Activity {
  network: NetworkNames;
  height: number;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  isIncoming: boolean;
  transactionHash: string;
  token: BaseTokenOptions;
  status: ActivityStatus;
  type: ActivityType;
  swapId?: string;
  rawInfo?: EthereumRawInfo | SubscanExtrinsicInfo;
}

interface ActivityLite {
  txid: string;
  height: number;

  // Note used:
  network: NetworkNames;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  isIncoming: boolean;
  transactionHash: string;
  token: BaseTokenOptions;
  status: ActivityStatus;
  type: ActivityType;
  swapId?: string;
  rawInfo?: EthereumRawInfo | SubscanExtrinsicInfo;
}

export {
  TransactionHistoryItem,
  TransactionRawInfo,
  ActivityLite,
  EthereumRawInfo,
  Activity,
  ActivityStatus,
  ActivityType,
  SubscanExtrinsicInfo,
};
