import React from 'react'

export const MostrarTiempoRestante = ({tiempoRestante}) => {


  const horaFormateada = tiempoRestante.horas ? tiempoRestante.horas : 0
  const minutosFormateados = tiempoRestante.minutos < 10 ? `0${tiempoRestante.minutos}` : tiempoRestante.minutos;
  return (
    <div className="contenedor-tiempo-corriendo">
      <span>
         {`${horaFormateada}:${minutosFormateados} `}
      </span>
    </div>
  )
}
