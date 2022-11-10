import { ProviderName, UIExportOptions } from "@/types/provider";
import getRoutes from "./routes";
const uiexport: UIExportOptions = {
  providerName: ProviderName.radiant,
  routes: getRoutes(ProviderName.radiant),
};
export default uiexport;
