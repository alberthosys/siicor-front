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
  access_list: string = "access-list ";
  deny_host: string = " deny host ";
  permit_any: string = " permit any";
  ip_acess_group: string = "ip access-group ";
  host:string=" host ";
  ip_address:string="ip address ";
  clock_rate:string="clock rate ";
  no_shutdown:string="no shutdown";
  encapsulation_dot1q:string="encapsulation dot1q "
}
