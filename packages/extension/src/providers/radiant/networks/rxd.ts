import { CoingeckoPlatform, NetworkNames } from "@samaraapp/types";
import { RvmNetwork, RvmNetworkOptions } from "../types/rvm-network";
import assetsInfoHandler from "@/providers/radiant/libs/assets-handlers/assetinfo-radiant";
import mewNFTHandler from "@/libs/nft-handlers/mew";
import { RadiantActivity } from "../libs/activity-handlers";
import wrapActivityHandler from "@/libs/activity-state/wrap-activity-handler";

const ethOptions: RvmNetworkOptions = {
  name: NetworkNames.Radiant,
  name_long: "Radiant",
  homePage: "https://radiantblockchain.org",
  blockExplorerTX: "https://radiantexplorer.com/tx/[[txHash]]",
  blockExplorerAddr: "https://radiantexplorer.com/address/[[address]]",
  chainID: 1,
  isTestNetwork: false,
  currencyName: "RXD",
  node: "wss://electrumx.radiantblockchain.org:50022",
  icon: require("./icons/rxd.svg"),
  gradient: "linear-gradient(180deg, #C549FF 0%, #684CFF 100%)",
  coingeckoID: "radiant",
  coingeckoPlatform: CoingeckoPlatform.Radiant,
  NFTHandler: mewNFTHandler,
  assetsInfoHandler,
  activityHandler: wrapActivityHandler(RadiantActivity),
};

const rxd = new RvmNetwork(ethOptions);

export default rxd;
