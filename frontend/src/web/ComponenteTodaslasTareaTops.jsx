import React, { useState } from "react";
import { ComponenteTareaTop } from "./ComponenteTareaTop";
import { useEffect } from "react";



export const ComponenteTodaslasTareaTops = ({ tareaTops }) => {





  
  return (
    <>
      <ComponenteTareaTop tareaTops={tareaTops} />
      <ul className="contedor-tareas-tops">
        <li className="tareas-tops">
          <div>
            <div className="informacion-tarea-top">
              <span className="tarea-top-nombre">{ tareaTops[1] && tareaTops[1].nombre} </span>
              <span className="tarea-top-mensaje">
               { tareaTops[1] && tareaTops[1].tarea}
              </span>
              <span className="tarea-top-puntos">puntos:</span>
            </div>
          </div>
        </li>
        <li className="tareas-tops">
          <div>
            <div className="informacion-tarea-top">
              <span className="tarea-top-nombre"> { tareaTops[2] && tareaTops[2].nombre} </span>
              <span className="tarea-top-mensaje">
              { tareaTops[2] && tareaTops[2].tarea}
              </span>
              <span className="tarea-top-puntos">puntos:</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};
