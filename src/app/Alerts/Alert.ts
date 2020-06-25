import Swal from 'sweetalert2'

export const alertSuccess = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 6000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
export const mensajeError = Swal.mixin({
  icon: 'error',
  title: 'Oops...',
  text: 'Ocurrio un error',
  footer: '<a href></a>'
})

export const alertConfirm = Swal.mixin({
  title: '<strong>Confirmación de la acción</strong>',
  icon: 'warning',
  html: 'Esta seguro que desea eliminar este elemento',
  showCloseButton: true,
  showCancelButton: true,
  focusConfirm: false,
  confirmButtonText:
    '<i class="fa fa-thumbs-up"></i> Aceptar',
  confirmButtonAriaLabel: 'Thumbs up, great!',
  cancelButtonText:
    '<i class="fa fa-thumbs-down"></i> Cancelar',
  cancelButtonAriaLabel: 'Thumbs down',
  showConfirmButton: true,
})
export class Alert {

  mensajeError(mensaje:string){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensaje,
      footer: '<a href></a>'
    })
  }

  alertSuccess(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: mensaje
    })
  }
  alertError(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'error',
      title: mensaje
    })
  }

}
