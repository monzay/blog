import React, { useState } from "react";
import { obtenerCredencialesUse } from "../App";

export const OccionesPrincipales = () => {
  const [mostrarOcciones, setMostrarOcciones] = useState({
    MostrarOsAañadir: false,
    MostrarOsTops: false,
    MostrarOsNotas: false,
  });

  



  return (
    <div className="contenedor-btns-occiones">
      
      <div
        className="btn-occiones"
        onClick={() => {
          
          setMostrarOcciones({
            MostrarOsAañadir: true,
            MostrarOsTops: false,
            MostrarOsNotas: false,
          });
        }}
      >
        a
      </div>
      <div
        className="btn-occiones"
        onClick={() =>
          setMostrarOcciones({
            MostrarOsAañadir: false,
            MostrarOsTops: true,
            MostrarOsNotas: false,
          })
        }
      >
        a
      </div>
      <div
        className="btn-occiones"
        onClick={() =>
          setMostrarOcciones({
            MostrarOsAañadir: false,
            MostrarOsTops: false,
            MostrarOsNotas: true,
          })
        }
      >
        dasdasd
      </div>
    </div>
  );
};
