import { AssetsType } from "@/types/provider";
import {
  CGToken,
  SupportedNetwork,
  SupportedNetworkNames,
  TokenBalance,
} from "./types/tokenbalance-radiant";
import MarketData from "@/libs/market-data";
import { fromBase } from "@/libs/utils/units";
import { toBN } from "web3-utils";
import BigNumber from "bignumber.js";
import {
  formatFiatValue,
  formatFloatingPointValue,
} from "@/libs/utils/number-formatter";
import API from "@/providers/radiant/libs/api";
import Sparkline from "@/libs/sparkline";
import { BaseNetwork } from "@/types/base-network";
import { RvmNetwork } from "../../types/rvm-network";
import { getKnownNetworkTokens, TokenList } from "./token-lists";
import { CoingeckoPlatform, NetworkNames } from "@samaraapp/types";
import { NATIVE_TOKEN_ADDRESS } from "../common";
import { WSSElectrumClient } from "../electrumx_wsclient";
import { BalanceData } from "@/types/base-token";
const API_ENDPOINT = "wss://electrumx.radiantblockchain.org:50022/";
export default async (
  network: BaseNetwork,
  address: string,
  withUnspentCoins?: boolean
): Promise<AssetsType[]> => {
  const supportedNetworks: Record<SupportedNetworkNames, SupportedNetwork> = {
    [NetworkNames.Radiant]: {
      tbName: "rxd",
      tokenurl: TokenList[NetworkNames.Radiant],
      cgPlatform: CoingeckoPlatform.Radiant,
    },
  };
  if (!Object.keys(supportedNetworks).includes(network.name))
    throw new Error("TOKENBALANCE-RADIANT: network not supported");

  const networkName = network.name as SupportedNetworkNames;
  const client: WSSElectrumClient = await WSSElectrumClient.Connection(
    API_ENDPOINT
  );
  const balanceData = await client.getBalance(address, withUnspentCoins);
  const hydrateData = async (
    balanceData: BalanceData
  ): Promise<AssetsType[]> => {
    const balances: Record<string, TokenBalance> = {
      ["000000000000000000000000000000000000000000000000000000000000000000000000"]:
        {
          balance: balanceData.balance,
          contract: address,
        },
    };
    const marketData = new MarketData();
    const nativeMarket = await marketData.getMarketData(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      [network.coingeckoID!] //it wont be null since all supported networks have coingeckoID
    );
    const marketInfo = await marketData.getMarketInfoByContracts(
      Object.keys(balances).filter(
        (contract) => contract !== NATIVE_TOKEN_ADDRESS
      ),
      supportedNetworks[networkName].cgPlatform as CoingeckoPlatform
    );
    marketInfo[NATIVE_TOKEN_ADDRESS] = nativeMarket[0];

    const assets: AssetsType[] = [];
    const tokenInfo: Record<string, CGToken> = await getKnownNetworkTokens(
      network.name
    );

    tokenInfo[NATIVE_TOKEN_ADDRESS] = {
      chainId: (network as RvmNetwork).chainID,
      name: network.name_long,
      decimals: 8,
      address: NATIVE_TOKEN_ADDRESS,
      logoURI: network.icon,
      symbol: network.currencyName,
    };

    const unknownTokens: string[] = [];
    let nativeAsset: AssetsType | null = null;
    for (const [address, market] of Object.entries(marketInfo)) {
      if (market && tokenInfo[address]) {
        const userBalance = fromBase(
          balances[address].balance,
          tokenInfo[address].decimals
        );
        const usdBalance = new BigNumber(userBalance).times(
          market.current_price
        );
        const asset: AssetsType = {
          balance: toBN(balances[address].balance).toString(),
          balancef: formatFloatingPointValue(userBalance).value,
          balanceUSD: usdBalance.toNumber(),
          balanceUSDf: formatFiatValue(usdBalance.toString()).value,
          icon: market.image,
          name: market.name,
          symbol: market.symbol,
          value: market.current_price.toString(),
          valuef: formatFiatValue(market.current_price.toString()).value,
          contract: address,
          decimals: tokenInfo[address].decimals,
          sparkline: new Sparkline(market.sparkline_in_7d.price, 25).dataUri,
          priceChangePercentage:
            market.price_change_percentage_7d_in_currency || 0,
          unspentCoins: balanceData.utxos,
        };
        if (address !== NATIVE_TOKEN_ADDRESS) assets.push(asset);
        else nativeAsset = asset;
      } else {
        unknownTokens.push(address);
      }
    }
    assets.sort((a, b) => {
      if (a.balanceUSD < b.balanceUSD) return 1;
      else if (a.balanceUSD > b.balanceUSD) return -1;
      else return 0;
    });
    assets.unshift(nativeAsset as AssetsType);
    /* if (unknownTokens.length && network.api) {
      const api = (await network.api()) as API;
      const promises = unknownTokens.map((t) => api.getTokenInfo(t));
      await Promise.all(promises).then((tokenInfo) => {
        tokenInfo.forEach((tInfo, idx) => {
          const userBalance = fromBase(
            balances[unknownTokens[idx]].balance,
            tInfo.decimals
          );
          const asset: AssetsType = {
            balance: toBN(balances[unknownTokens[idx]].balance).toString(),
            balancef: formatFloatingPointValue(userBalance).value,
            balanceUSD: 0,
            balanceUSDf: formatFiatValue("0").value,
            icon: nativeMarket[0]?.image || "",
            name: tInfo.name,
            symbol: tInfo.symbol,
            value: "0",
            valuef: formatFiatValue("0").value,
            contract: address,
            decimals: tInfo.decimals,
            sparkline: "",
            priceChangePercentage: 0,
          };
          assets.push(asset);
        });
      });
    }*/
    return assets;
  };
  const hydrated = await hydrateData(balanceData);
  return hydrated;
};
