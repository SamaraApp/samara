import cacheElectrumx from "@/libs/cache-electrumx";
import { RvmNetwork } from "@/providers/radiant/types/rvm-network";
import {
  Activity,
  ActivityLite,
  ActivityStatus,
  ActivityType,
  TransactionHistoryItem,
} from "@/types/activity";
import { BaseNetwork } from "@/types/base-network";
import { numberToHex } from "web3-utils";
import { WSSElectrumClient } from "../../../electrumx_wsclient";
import { decodeTx } from "../../../transaction/decoder";
import { NetworkEndpoints } from "./configs";
const TTL = 30000;
const getAddressActivity = async (
  address: string,
  endpoint: string
): Promise<TransactionHistoryItem[]> => {
  const client: WSSElectrumClient = await WSSElectrumClient.Connection(
    endpoint
  );
  return client.getAddressHistory(address).then((res) => {
    const results = res as TransactionHistoryItem[];
    const newResults = results.map((tx) => {
      const item = {
        txid: tx.txid,
        height: tx.height,
        network: "radiant",
        from: address,
        to: address,
        value: "0",
        timestamp: 0,
        isIncoming: true,
        transactionHash: tx.txid,
        token: {
          decimals: 8,
          name: "Native",
        },
        status: ActivityStatus.success,
        type: ActivityType.transaction,
      };
      return item;
    });
    return newResults.slice(0, 50) as TransactionHistoryItem[];
  });
};
export default async (
  network: BaseNetwork,
  address: string
): Promise<ActivityLite[]> => {
  const enpoint =
    NetworkEndpoints[network.name as keyof typeof NetworkEndpoints];
  const activities = await getAddressActivity(address, enpoint);
  const Promises = activities.map((activity) => {
    return activity;
  });
  return Promise.all(Promises);
};
