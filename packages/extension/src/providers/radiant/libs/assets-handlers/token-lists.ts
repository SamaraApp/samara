import cacheFetch from "@/libs/cache-fetch";
import { NetworkNames } from "@samaraapp/types";
import { CGToken, SupportedNetworkNames } from "./types/tokenbalance-radiant";
const TOKEN_FETCH_TTL = 1000 * 60 * 60;
const TokenList: Record<SupportedNetworkNames, string> = {
  [NetworkNames.Radiant]: "https://tokens.coingecko.com/ethereum/all.json"
};

const getKnownNetworkTokens = async (
  networkName: NetworkNames
): Promise<Record<string, CGToken>> => {
  if (!TokenList[networkName as SupportedNetworkNames]) return {};
  return cacheFetch(
    {
      url: TokenList[networkName as SupportedNetworkNames],
    },
    TOKEN_FETCH_TTL
  ).then((json) => {
    const tokens: CGToken[] = json.tokens;
    const tObject: Record<string, CGToken> = {};
    tokens.forEach((t) => {
      tObject[t.address] = t;
    });
    return tObject;
  });
};
export { TokenList, getKnownNetworkTokens };
