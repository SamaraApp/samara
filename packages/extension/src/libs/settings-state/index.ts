import { InternalStorageNamespace } from "@/types/provider";
import BrowserStorage from "@/libs/common/browser-storage";
import {
  StorageKeys,
  RVMSettingsType,
  SettingsType,
} from "./types";
import { merge } from "lodash";
class SettingsState {
  #storage: BrowserStorage;
  constructor() {
    this.#storage = new BrowserStorage(InternalStorageNamespace.settingsState);
  }
  async getEVMSettings(): Promise<RVMSettingsType> {
    const DEFUALT_ETH_TTL = 60 * 60 * 1000;
    const state = await this.getStateByKey(StorageKeys.rvmState);
    const settings: RVMSettingsType = {
      inject: { disabled: false, timestamp: 0 },
    };
    const merged: RVMSettingsType = merge(settings, state);
    const currentTime = new Date().getTime();
    merged.inject.disabled =
      merged.inject.timestamp + DEFUALT_ETH_TTL < currentTime
        ? false
        : merged.inject.disabled;
    return merged;
  }
  async deleteStateByKey(key: string): Promise<void> {
    await this.#storage.remove(key);
  }
  async deleteAllStates(): Promise<void> {
    return await this.#storage.clear();
  }
  async setRVMSettings(state: RVMSettingsType): Promise<void> {
    await this.#storage.set(StorageKeys.rvmState, state);
  }
  async getAllSettings(): Promise<SettingsType> {
    const rvmstate = await this.getEVMSettings();
    return {
      rvm: rvmstate,
    };
  }
  async getStateByKey(key: string): Promise<any> {
    const state = await this.#storage.get(key);
    if (!state) return {};
    else return state;
  }
}
export default SettingsState;
