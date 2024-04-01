import React from 'react'

export const MostrarTiempoRestante = ({tiempoRestante}) => {
  return (
    <div className="contenedor-tiempo-corriendo">
     <span>{tiempoRestante[0].horas } </span>: <span>{tiempoRestante[0].minutos >= 10 ? tiempoRestante[0].minutos : ` 0${tiempoRestante[0].minutos}`} </span>
    </div>
  )
}
