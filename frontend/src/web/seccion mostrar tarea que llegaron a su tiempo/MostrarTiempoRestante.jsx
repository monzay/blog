import React, { useContext } from 'react'
import { contextoEjecutarRetomarTiempo } from '../../Contextos/ProviderEjecutarRetomarTiempo'
export const MostrarTiempoRestante = () => {

  const {tiempoRestante } = useContext(contextoEjecutarRetomarTiempo)


  const horaFormateada = tiempoRestante.horas 
  const minutosFormateados = tiempoRestante.minutos < 10 ? `0${tiempoRestante.minutos}` : tiempoRestante.minutos;
  return (
    <div className="contenedor-tiempo-corriendo">
      <span>
         {`${horaFormateada}:${minutosFormateados} `}
      </span>
    </div>
  )
}
