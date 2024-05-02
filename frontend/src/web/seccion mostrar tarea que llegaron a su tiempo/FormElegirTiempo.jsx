import React from "react";
import { useEffect } from "react";

export const FormElegirTiempo = ({ setTiempo,tiempo, click_ejecucion, error }) => {


  useEffect(() => {
    if(tiempo.length === 3){
      setTiempo(prev =>  prev[0]+prev[1]+":"+ prev.slice(1,-1))
    }
  }, [tiempo])
  

  return (
    <>
      <form
        onSubmit={(e) => click_ejecucion(e)}
        className="contenedor-input-componente-mostrar-hora-de-hacer"
      >
        <input
          className="input-componente-mostrar-hora-de-hacer"
          type="text"
          onChange={(e) => setTiempo(e.target.value)}
          value={tiempo}
          maxLength="5"
          placeholder="tiempo"
/>
        <button className="btn-componente-mostrar-hora-de-la-tarea">
          enviar
        </button>
      </form>
      <span>{error}</span>
    </>
  );
};
