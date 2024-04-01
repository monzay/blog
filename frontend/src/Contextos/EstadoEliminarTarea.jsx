import React from "react";
import { useState, createContext } from "react";
export const contextoEstadoEliminarTarea = createContext();

export const EstadoEliminarTarea = ({ children }) => {
  const [eliminoUnaTareas, setEliminoUnaTarea] = useState(false);
  const [actualizoUnaTarea, setActualizoUnaTarea] = useState(false);
  const [añadirTarea, setAñadirTarea] = useState(false);



  return (
    <contextoEstadoEliminarTarea.Provider
      value={{
        añadirTarea,
        setAñadirTarea,
        eliminoUnaTareas,
        setEliminoUnaTarea,
        actualizoUnaTarea,
        setActualizoUnaTarea,
      }}
    >
      {children}
    </contextoEstadoEliminarTarea.Provider>
  );
};
