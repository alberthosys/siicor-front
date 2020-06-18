import { Universal } from "./Universal";

export class Routers extends Universal {
  router_eigrp: string = "router eigrp ";
  network: string = "network ";
  router_rip: string = "router rip";
  version_rip: string = "version 2";
  access_list:string="access-list ";
  deny_host:string=" deny host ";
  permit_any:string=" permit any"
  ip_acess_group:string="ip access-group "
}
