import { ProviderName, UIExportOptions } from "@/types/provider";
import getRoutes from "./routes";
const uiexport: UIExportOptions = {
  providerName: ProviderName.samara,
  routes: getRoutes(ProviderName.samara),
};
export default uiexport;
