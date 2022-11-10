import { SettingsType } from "@/libs/settings-state/types";

export interface SamaraWindow {
  samara: {
    providers: {
      [key: string]: any;
    };
    settings: SettingsType;
  };
  [key: string]: any;
}
