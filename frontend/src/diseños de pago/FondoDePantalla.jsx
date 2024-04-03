// fondo de pago 
export  function  fondoDePantalla (){
    const objeto = new Date()
    const hora =  objeto.getHours()
    const minutos = objeto.getMinutes()
    const horaFormateada = hora < 10 ? `0${hora}` : hora;
    const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;

    const tiempo = `${horaFormateada}:${minutosFormateados}`;
    return tiempo
  }