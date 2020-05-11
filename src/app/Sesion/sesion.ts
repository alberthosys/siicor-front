export class Sesion {

  public getSesion() {
    try {
      let sesion = localStorage.getItem('localip');
      console.log("IP->"+sesion)
      if(sesion){
        return true;
      }else{
        return false;
      }
    } catch (e) {
      return false
    }
    return true
  }
}
