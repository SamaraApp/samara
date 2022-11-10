import { ProviderName } from "@/types/provider";
import { NetworkNames } from "@samaraapp/types";
import RadiantNetworks from "@/providers/radiant/networks";
import { BaseNetwork } from "@/types/base-network";
const providerNetworks: Record<ProviderName, Record<string, BaseNetwork>> = {
  [ProviderName.radiant]: RadiantNetworks,
  [ProviderName.samara]: {},
};
const getAllNetworks = (): BaseNetwork[] => {
  return Object.values(RadiantNetworks) as BaseNetwork[];
};
const getNetworkByName = (name: string): BaseNetwork | undefined => {
  return getAllNetworks().find((net) => net.name === name);
};
const getProviderNetworkByName = (
  provider: ProviderName,
  networkName: string
): BaseNetwork | undefined => {
  return (Object.values(providerNetworks[provider]) as BaseNetwork[]).find(
    (net) => net.name === networkName
  );
};
const DEFAULT_RVM_NETWORK_NAME = NetworkNames.Radiant;
const POPULAR_NAMES = [
  NetworkNames.Radiant,
];
export {
  getAllNetworks,
  getNetworkByName,
  getProviderNetworkByName,
  DEFAULT_RVM_NETWORK_NAME,
  POPULAR_NAMES,
};
