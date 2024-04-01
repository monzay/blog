import React from 'react'

export const FormElegirTiempo = ({setHora,setMinutos,clickEjecucion}) => {
  return (
       <div className="contenedor-input-componente-mostrar-hora-de-hacer">
          <input  className="input-componente-mostrar-hora-de-hacer" type="number" onChange={(e) => setHora(e.target.value)} />
          <input className="input-componente-mostrar-hora-de-hacer"  type="number" onChange={(e) => setMinutos(e.target.value)} />
          <button  className="btn-componente-mostrar-hora-de-la-tarea"   onClick={clickEjecucion}>enviar</button>
        </div>
  )
}
