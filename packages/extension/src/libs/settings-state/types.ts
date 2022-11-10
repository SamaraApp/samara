export enum StorageKeys {
  rvmState = "rvm-settings-state",
}
export interface RVMInjectSettings {
  disabled: boolean;
  timestamp: number;
}
export interface RVMSettingsType {
  inject: RVMInjectSettings;
}
export interface SettingsType {
  rvm: RVMSettingsType;
}
