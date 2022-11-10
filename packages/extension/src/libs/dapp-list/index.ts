import { DAppsItem } from "@/types/ui";
import { NetworkNames } from "@samaraapp/types";
import rxd from "./rxd";

const lists: Partial<Record<NetworkNames, DAppsItem[]>> = {
  [NetworkNames.Radiant]: rxd,
};

export default lists;
