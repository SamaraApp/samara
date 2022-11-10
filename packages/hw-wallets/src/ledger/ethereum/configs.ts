import { NetworkNames } from "@samaraapp/types";
import { bip44Paths } from "../../configs";

const supportedPaths = {
  [NetworkNames.Ethereum]: [
    bip44Paths.ethereumLedger,
    bip44Paths.ethereumLedgerLive,
  ],
};
export { supportedPaths };
