export class Sesion {

  public getSesion() {

    let sesion = localStorage.getItem('localip');
    console.log("IP->" + sesion)
    if (sesion) {
      return true;
    } else {
      return false;
    }

  }
}
