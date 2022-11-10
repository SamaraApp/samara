import type RadiantProvider from "@/providers/radiant";
 
export interface TabProviderType {
  [key: string]: Record<number, RadiantProvider>;
}
export interface ProviderType {
  [key: string]: typeof RadiantProvider;
}
export interface ExternalMessageOptions {
  savePersistentEvents: boolean;
}
