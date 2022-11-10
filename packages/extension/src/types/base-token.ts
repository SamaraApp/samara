import RadiantAPI from "@/providers/radiant/libs/api";
import MarketData from "@/libs/market-data";
import { BN } from "ethereumjs-util";

export type TransferType = "keepAlive" | "all" | "allKeepAlive" | "transfer";

export interface UTXO {
  txid: string;
  value: number;
  script: string;
  outputIndex: number;
}

export interface BalanceData {
  balance: string;
  unconfirmed: number;
  confirmed: number;
  utxos: UTXO[];
}

export interface SendOptions {
  type: TransferType;
}

export interface BaseTokenOptions {
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
  coingeckoID?: string;
  existentialDeposit?: BN;
  balance?: string;
  price?: string;
  unspentCoins: UTXO[];
}

export abstract class BaseToken {
  public name: string;
  public symbol: string;
  public decimals: number;
  public icon: string;
  public coingeckoID: string | undefined;
  public existentialDeposit: BN | undefined;
  public balance?: string;
  public price?: string;
  public unspentCoins: UTXO[];

  constructor(options: BaseTokenOptions) {
    this.name = options.name;
    this.symbol = options.symbol;
    this.decimals = options.decimals;
    this.icon = options.icon;
    this.coingeckoID = options.coingeckoID;
    this.existentialDeposit = options.existentialDeposit;
    this.price = options.price || "0";
    this.balance = options.balance;
    this.unspentCoins = options.unspentCoins;
  }

  public async getLatestPrice(): Promise<string | null> {
    if (this.coingeckoID) {
      const market = new MarketData();

      return market.getTokenPrice(this.coingeckoID).then((price) => {
        if (price) {
          this.price = price;
        }

        return price;
      });
    }

    return null;
  }

  public abstract getLatestUserBalance(
    api: RadiantAPI,
    address: string
  ): Promise<string>;

  public abstract send(
    api: RadiantAPI,
    to: string,
    amount: string,
    options?: SendOptions
  ): Promise<any>;
}
