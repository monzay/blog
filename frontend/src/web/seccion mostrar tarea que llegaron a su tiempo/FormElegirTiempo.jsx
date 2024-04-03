import React from "react";

export const FormElegirTiempo = ({ setTiempo, clickEjecucion, error }) => {
  return (
    <>
      <form
        onSubmit={(e) => clickEjecucion(e)}
        className="contenedor-input-componente-mostrar-hora-de-hacer"
      >
        <input
          className="input-componente-mostrar-hora-de-hacer"
          type="text"
          onChange={(e) => setTiempo(e.target.value)}
        />
        <button className="btn-componente-mostrar-hora-de-la-tarea">
          enviar
        </button>
      </form>
      <span>{error}</span>
    </>
  );
};
