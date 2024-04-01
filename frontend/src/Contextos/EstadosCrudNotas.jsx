import React from "react";
import { useState, createContext } from "react";

export const contextoEstadosCrudNotas = createContext();

export const EstadosCrudNotas = ({ children }) => {
  const [dependenciasCrudNotas, setDependenciasCrudNotas] = useState({
    actualizar: false,
    eliminar: false,
    añadir: false,
  });
  return (
    <contextoEstadosCrudNotas.Provider
      value={{
        dependenciasCrudNotas,
        setDependenciasCrudNotas,
      }}
    >
      {children}
    </contextoEstadosCrudNotas.Provider>
  );
};
