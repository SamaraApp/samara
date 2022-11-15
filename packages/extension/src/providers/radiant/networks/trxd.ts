import { NetworkNames } from "@samaraapp/types";
import { RvmNetwork, RvmNetworkOptions } from "../types/rvm-network";
import { RadiantActivity } from "../libs/activity-handlers";
import wrapActivityHandler from "@/libs/activity-state/wrap-activity-handler";

const opts: RvmNetworkOptions = {
  name: NetworkNames.RadiantTestnet,
  name_long: "Radiant Testnet (tRXD)",
  homePage: "https://radiantblockchain.org",
  blockExplorerTX: "https://testnet.radiantexplorer.com/tx/[[txHash]]",
  blockExplorerAddr: "https://testnet.radiantexplorer.com/address/[[address]]",
  chainID: 2,
  isTestNetwork: true,
  currencyName: "tRXD",
  node: "ws://electrumx-testnet.radiantblockchain.org:50020",
  icon: require("./icons/rxd.png"),
  gradient: "linear-gradient(180deg, #C549FF 0%, #684CFF 100%)",
  activityHandler: wrapActivityHandler(RadiantActivity),
};

const trxd = new RvmNetwork(opts);

export default trxd;
