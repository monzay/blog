// fondo de pago 
export  function  fondoDePantalla (){
    const objeto = new Date()
    const hora =  objeto.getHours()
    const minutos = objeto.getMinutes()
    const tiempo =  hora + ":"  + minutos 
    return tiempo
  }