import { SamaraAccount } from "@samaraapp/types";
import { Token } from "./token";

export interface Account {
  name: string;
  address: string;
  amount: number;
  primaryToken: Token;
}

export interface AccountsHeaderData {
  selectedAccount: SamaraAccount | null;
  activeAccounts: SamaraAccount[];
  inactiveAccounts: SamaraAccount[];
  activeBalances: string[];
}
