import React, { useContext, useState } from "react";
import { contextoEstadosCrudNotas } from "../Contextos/EstadosCrudNotas";

export const AñadirNota = () => {
  const {setDependenciasCrudNotas} = useContext(contextoEstadosCrudNotas)
  const [nota, setNota] = useState("");

  function añadirNota(e) {
    e.preventDefault();

    if (nota) {
      const notaLocales = JSON.parse(localStorage.getItem("notas"));
      let nuevoId;
      do {
        nuevoId = Math.floor(Math.random() * 100);
      } while (notaLocales.find(nota => nota.id === nuevoId));
      const objetoNota = {
        tipo: "nota",
        nota: nota,
        id:nuevoId
      };
      notaLocales.unshift(objetoNota);
      localStorage.setItem("notas", JSON.stringify(notaLocales));
      setDependenciasCrudNotas({
        actualizar: false,
        eliminar: false,
        añadir: !false,
      })
    }
  }

  return (
    <form onSubmit={(e) => añadirNota(e)}>
      <input type="text" onChange={(e) => setNota(e.target.value)} />
      <button>enviar</button>
    </form>
  );
};
