import React from 'react'

export const BtnControladores = ({clickFuncion,txt,state,param}) => {
  return (
    <button   className="btn-componente-mostrar-hora-de-la-tarea"  onClick={()=> {
      clickFuncion()
      state(param)
    }}>
        {txt}
    </button>
  )
}
