export enum StorageKeys {
  providerInfo = "provider-info",
}
export interface IState {
  selectedNetwork?: string;
  selectedAddress?: string;
  unspentCoins?: {
    [address: string]: any[];
  };
}
