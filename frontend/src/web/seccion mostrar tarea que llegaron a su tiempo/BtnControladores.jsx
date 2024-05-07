import React from 'react'

export const BtnControladores = ({funcion,txt,state,param}) => {
  return (
    <button   className="btn-componente-mostrar-hora-de-la-tarea"  onClick={()=>{
      state(param)
      funcion()
    }}>
        {txt}
    </button>
  )
}
