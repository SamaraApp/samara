import { RouteRecordRaw } from "vue-router";
import Home from "./home.vue";

import RadiantUI from "@/providers/radiant/ui";
import SamaraUI from "./samara";
const uiproviders = [RadiantUI, SamaraUI];
let uiRoutes: RouteRecordRaw[] = [];
uiproviders.forEach((provider) => {
  uiRoutes = uiRoutes.concat(provider.routes);
});
const routes = [{ path: "/", component: Home, name: "home" }, ...uiRoutes];
export default routes;
