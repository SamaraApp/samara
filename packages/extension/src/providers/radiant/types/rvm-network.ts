import MarketData from "@/libs/market-data";
import { toValidatedAddress } from "@/libs/radiant-helpers/radiant-core-helpers";
import Sparkline from "@/libs/sparkline";
import { TokensState } from "@/libs/tokens-state";
import { CustomRip20Token, TokenType } from "@/libs/tokens-state/types";
import {
  formatFiatValue,
  formatFloatingPointValue,
} from "@/libs/utils/number-formatter";
import { fromBase } from "@/libs/utils/units";
import { Activity } from "@/types/activity";
import { BaseNetwork } from "@/types/base-network";
import { BaseToken } from "@/types/base-token";
import { NFTCollection } from "@/types/nft";
import { AssetsType, ProviderName } from "@/types/provider";
import {
  CoingeckoPlatform,
  NetworkNames,
  SignerType,
} from "@samaraapp/types";
import BigNumber from "bignumber.js";
import API from "../libs/api";
import createIcon from "../libs/blockies";
import { NATIVE_TOKEN_ADDRESS } from "../libs/common";
import { Rip20Token, Rip20TokenOptions } from "./rip20-token";

export interface RvmNetworkOptions {
  name: NetworkNames;
  name_long: string;
  homePage: string;
  blockExplorerTX: string;
  blockExplorerAddr: string;
  chainID: number;
  isTestNetwork: boolean;
  currencyName: string;
  node: string;
  icon: string;
  gradient: string;
  coingeckoID?: string;
  coingeckoPlatform?: CoingeckoPlatform;
  basePath?: string;
  NFTHandler?: (
    network: BaseNetwork,
    address: string
  ) => Promise<NFTCollection[]>;
  assetsInfoHandler?: (
    network: BaseNetwork,
    address: string
  ) => Promise<AssetsType[]>;
  activityHandler: (
    network: BaseNetwork,
    address: string
  ) => Promise<Activity[]>;
  customTokens?: boolean;
}

export class RvmNetwork extends BaseNetwork {
  public chainID: number;

  private assetsInfoHandler?: (
    network: BaseNetwork,
    address: string,
    withUnspentCoins?: boolean
  ) => Promise<AssetsType[]>;

  NFTHandler?: (
    network: BaseNetwork,
    address: string
  ) => Promise<NFTCollection[]>;

  private activityHandler: (
    network: BaseNetwork,
    address: string
  ) => Promise<Activity[]>;

  public assets: Rip20Token[] = [];

  constructor(options: RvmNetworkOptions) {
    const api = async () => {
      const api = new API(options.node);
      await api.init();
      return api;
    };

    const baseOptions = {
      signer: [SignerType.secp256k1],
      provider: ProviderName.radiant,
      displayAddress: (address: string) => toValidatedAddress(address),
      identicon: createIcon,
      basePath: options.basePath ? options.basePath : "m/44'/0'/0'/0",
      decimals: 8,
      api,
      ...options,
    };

    baseOptions.customTokens = baseOptions.customTokens ?? true;
    super(baseOptions);

    this.chainID = options.chainID;
    this.assetsInfoHandler = options.assetsInfoHandler;
    this.NFTHandler = options.NFTHandler;
    this.activityHandler = options.activityHandler;
  }

  public async getAllTokens(
    address: string,
    withUnspentCoins = false
  ): Promise<BaseToken[]> {
    const assets = await this.getAllTokenInfo(address, withUnspentCoins);
    return assets.map((token) => {
      const bTokenOptions: Rip20TokenOptions = {
        decimals: token.decimals,
        icon: token.icon,
        name: token.name,
        symbol: token.symbol,
        balance: token.balance,
        price: token.value,
        contract: token.contract!,
        unspentCoins: token.unspentCoins,
      };
      return new Rip20Token(bTokenOptions);
    });
  }

  public async getAllTokenInfo(
    address: string,
    withUnspentCoins = false
  ): Promise<AssetsType[]> {
    const api = await this.api();
    const tokensState = new TokensState();
    const marketData = new MarketData();

    let assets: AssetsType[] = [];
    if (this.assetsInfoHandler) {
      assets = await this.assetsInfoHandler(this, address, withUnspentCoins);
    } else {
      const balance = await (api as API).getBalance(address);
      const nativeMarketData = (
        await marketData.getMarketData([this.coingeckoID!])
      )[0];
      const nativeUsdBalance = new BigNumber(
        fromBase(balance, this.decimals)
      ).times(nativeMarketData?.current_price ?? 0);
      const nativeAsset: AssetsType = {
        name: this.name_long,
        symbol: this.name,
        icon: this.icon,
        balance,
        balancef: formatFloatingPointValue(fromBase(balance, this.decimals))
          .value,
        balanceUSD: nativeUsdBalance.toNumber(),
        balanceUSDf: formatFiatValue(nativeUsdBalance.toString()).value,
        value: nativeMarketData?.current_price.toString() ?? "0",
        valuef: formatFiatValue(
          nativeMarketData?.current_price.toString() ?? "0"
        ).value,
        decimals: this.decimals,
        sparkline: nativeMarketData
          ? new Sparkline(nativeMarketData.sparkline_in_7d.price, 25).dataUri
          : "",
        priceChangePercentage:
          nativeMarketData?.price_change_percentage_7d_in_currency ?? 0,
        contract: NATIVE_TOKEN_ADDRESS,
        unspentCoins: [],
      };

      await Promise.all(
        this.assets.map((token) =>
          token
            .getLatestUserBalance(api as API, address)
            .then((balance: any) => {
              token.balance = balance;
            })
        )
      );

      const assetInfos = this.assets
        .map((token) => {
          const assetsType: AssetsType = {
            name: token.name,
            symbol: token.symbol,
            icon: token.icon,
            balance: token.balance!,
            balancef: formatFloatingPointValue(
              fromBase(token.balance!, token.decimals)
            ).value,
            balanceUSD: 0,
            balanceUSDf: "0",
            value: "0",
            valuef: "0",
            decimals: token.decimals,
            sparkline: "",
            priceChangePercentage: 0,
            contract: token.contract,
            unspentCoins: token.unspentCoins,
          };
          return assetsType;
        })
        .filter((asset) => asset.balancef !== "0");

      assets = [nativeAsset, ...assetInfos];
    }

    const customTokens = await tokensState
      .getTokensByNetwork(this.name)
      .then((tokens) => {
        const rip20Tokens = tokens.filter((token) => {
          if (token.type !== TokenType.RIP20) {
            return false;
          }

          for (const a of assets) {
            if (
              a.contract &&
              (token as CustomRip20Token).address &&
              a.contract.toLowerCase() ===
                (token as CustomRip20Token).address.toLowerCase()
            ) {
              return false;
            }
          }

          return true;
        }) as CustomRip20Token[];

        return rip20Tokens.map(
          ({ name, symbol, address, icon, decimals, unspentCoins }) =>
            new Rip20Token({
              name,
              symbol,
              contract: address,
              icon,
              decimals,
              unspentCoins,
            })
        );
      });

    const balancePromises = customTokens.map((token) =>
      token.getLatestUserBalance(api as API, address)
    );

    await Promise.all(balancePromises);

    const marketInfos = await marketData.getMarketInfoByContracts(
      customTokens.map((token) => token.contract.toLowerCase()),
      this.coingeckoPlatform!
    );

    const customAssets: AssetsType[] = customTokens.map((token) => {
      const asset: AssetsType = {
        name: token.name,
        symbol: token.symbol,
        balance: token.balance ?? "0",
        balancef: formatFloatingPointValue(
          fromBase(token.balance ?? "0", token.decimals)
        ).value,
        contract: token.contract,
        balanceUSD: 0,
        balanceUSDf: "0",
        value: "0",
        valuef: "0",
        decimals: this.decimals,
        sparkline: "",
        priceChangePercentage: 0,
        icon: token.icon,
        unspentCoins: token.unspentCoins,
      };

      const marketInfo = marketInfos[token.contract.toLowerCase()];

      if (marketInfo) {
        const usdBalance = new BigNumber(token.balance ?? "0").times(
          marketInfo.current_price
        );
        asset.balanceUSD = usdBalance.toNumber();
        asset.balanceUSDf = formatFiatValue(usdBalance.toString()).value;
        asset.value = marketInfo.current_price.toString();
        asset.valuef = formatFiatValue(
          marketInfo.current_price.toString()
        ).value;
        asset.sparkline = new Sparkline(
          marketInfo.sparkline_in_7d.price,
          25
        ).dataUri;
        asset.priceChangePercentage =
          marketInfo.price_change_percentage_7d_in_currency || 0;
      }

      return asset;
    });

    return [...assets, ...customAssets];
  }
  public getAllActivity(address: string): Promise<Activity[]> {
    return this.activityHandler(this, address);
  }
}
