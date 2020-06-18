import { Universal } from "./Universal";

export class Routers extends Universal {
  router_eigrp: string = "router eigrp ";
  network: string = "network ";
  router_rip: string = "router rip";
  version_rip: string = "version 2";
  no_auto_summary: string = "no auto-summary";
  no_network: string = "no network ";
  no_router_eigrp: string = "no router eigrp ";
  no_router_rip: string = "no router rip";
}
