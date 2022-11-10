import type { Endpoint } from "@samaraapp/extension-bridge/dist/types";
import type { ProviderName } from "./provider";
import type { OnMessageResponse, ProviderError } from "@samaraapp/types";

export enum MessageType {
  WINDOW_REQUEST = "samara_window_request",
  NEWWINDOW_REQUEST = "samara_new_window_request",
  ACTION_REQUEST = "samara_action_request",
  CS_REQUEST = "samara_cs_request",
  BACKGROUND_REQUEST = "samara_background_request",
}
export enum Destination {
  contentScript = "content-script",
  background = "background",
  window = "window",
  newWindow = "new-window",
  popup = "popup",
}

export enum InjectedIDs {
  main = "samara-inject",
}

export enum InternalMethods {
  getEthereumEncryptionPublicKey = "samara_eth_encryption_pubkey",
  ethereumDecrypt = "samara_eth_decrypt",
  sign = "samara_sign_hash",
  unlock = "samara_unlock_keyring",
  lock = "samara_lock_keyring",
  isLocked = "samara_is_locked_keyring",
  newWindowInit = "samara_newWindowInit",
  getSettings = "samara_getAllSettings",
  newWindowUnload = "samara_newWindowUnload",
  sendToTab = "samara_sendToTab",
  getNewAccount = "samara_getNewAccount",
  saveNewAccount = "samara_saveNewAccount",
  changeNetwork = "samara_changeNetwork",
}
export interface SendMessage {
  [key: string]: any;
  provider: ProviderName;
  message: string;
}
export interface ActionSendMessage {
  [key: string]: any;
  provider?: ProviderName;
  message: string;
  tabId?: number;
}
export interface Message extends SendMessage {
  sender: Endpoint;
}

export type onMessageType = (
  message: Message
) => Promise<OnMessageResponse | void>;

export interface InternalOnMessageResponse {
  result?: string;
  error?: ProviderError;
}
export type InternalMessageType = (
  message: Message
) => Promise<InternalOnMessageResponse>;
