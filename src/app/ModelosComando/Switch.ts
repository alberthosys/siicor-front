import { Universal } from "./Universal";

export class Switch extends Universal {
  no_vlan: string = "no vlan ";
  vlan_number: string = "vlan ";
  vlan_name: string = "name ";
  exit: string = "exit";
  vlan_rango_uno: string = "interface range ";
  vlan_sin_rango: string = "interface "
  vlan_rango_mode_acc: string = "switchport mode access";
  vlan_rango_acc_vlan: string = "switchport access vlan ";
  vlan_rango_mode_trunk: string = "switchport mode trunk";
  vlan_rango_trunk_native: string = "switchport trunk native vlan ";
  vlan_ruteo_vlan: string = "interface vlan ";
  vlan_ruteo_ip: string = "ip address ";
  no_vlan_mode_acc: string = "no switchport access vlan ";
  no_vlan_mode_trunk: string = "no switchport trunk native vlan ";
  no_ruteo_vlan: string = "no interface vlan ";
}
