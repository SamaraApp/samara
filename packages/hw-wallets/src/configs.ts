import { HWwalletType, NetworkNames } from "@samaraapp/types";
import { PathType, WalletConfigs } from "./types";

const walletConfigs: WalletConfigs = {
  [HWwalletType.ledger]: {
    isBackground: false,
  },
  [HWwalletType.trezor]: {
    isBackground: true,
  },
};
const ledgerAppNames = {
  [NetworkNames.Radiant]: "Radiant",
};
const MessengerName = "samara_hw_wallets";

const bip44Paths: Record<string, PathType> = {
  ethereumLedger: {
    path: "m/44'/60'/0'/{index}",
    basePath: "m/44'/60'/0'",
    label: "Ethereum",
  },
  ethereumLedgerLive: {
    path: "m/44'/60'/{index}'/0/0",
    basePath: "m/44'/60'",
    label: "Ethereum - Ledger Live",
  },
  ethereumTestnetLedger: {
    path: "m/44'/1'/0'/{index}",
    basePath: "m/44'/1'/0'",
    label: "Testnet",
  },
  ethereumClassicLedger: {
    path: "m/44'/61'/0'/{index}",
    basePath: "m/44'/61'/0'",
    label: "Ethereum Classic",
  },
  ethereumClassicLedgerLive: {
    path: "m/44'/61'/{index}'/0/0",
    basePath: "m/44'/61'",
    label: "Ethereum Classic -  Ledger Live",
  },
  ethereum: {
    path: "m/44'/60'/0'/0/{index}",
    basePath: "m/44'/60'/0'/0",
    label: "Ethereum",
  },
  ethereumClassic: {
    path: "m/44'/61'/0'/0/{index}",
    basePath: "m/44'/61'/0'/0",
    label: "Ethereum Classic",
  },
  ethereumTestnet: {
    path: "m/44'/1'/0'/0/{index}",
    basePath: "m/44'/1'/0'/0",
    label: "Testnet",
  }
};
export { walletConfigs, MessengerName, ledgerAppNames, bip44Paths };
