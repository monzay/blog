import React, { useState, useEffect, useRef, useContext } from "react";
import { contextoTareas } from "../Contextos/ProviderTareas";
import { obtenerCredencialesUse } from "../funciones globales/obtenenerDatosDelLocalStorage";
import { contextoEstadoEliminarTarea } from "../Contextos/EstadoEliminarTarea";



export const ComponenteActualizarTarea = ({id,setMostrarModelActualizar}) => {

  const {tareaUser} = useContext(contextoTareas)
  const {actualizoUnaTarea,setActualizoUnaTarea }= useContext(contextoEstadoEliminarTarea)
  //estados 
  const [newTarea, setNewTarea] = useState("");
  const [newTiempo, setNewTiempo] = useState("");
  const [alturaTextarea, setAlturaTextarea] = useState(0);
  // TODOS LOS useRef()
  const elementDomTextarea = useRef(null);

  const [textoTareaParaEditar,settextoTareaParaEditar] = useState("")


  async function actualizarTarea(tareaID,e) {
    e.preventDefault();
    const oldTarea = tareaUser.find((t) => t.tareaID === tareaID);
    const nuevaTarea = {
      ...oldTarea,
      idUser:  obtenerCredencialesUse( ).idUser,
      tarea: newTarea ? newTarea : oldTarea.tarea,
      tiempo: newTiempo ? newTiempo : oldTarea.tiempo,
    };
    try {
      const response = await fetch("http://localhost:3000/app/actualizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaTarea),
      });
      if(response.ok){
        setMostrarModelActualizar(false)
        setActualizoUnaTarea(!actualizoUnaTarea)
      }
      else console.error(error.message)
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  }

  useEffect(() => {
    const handler = (e) => {
      let altura = e.target.scrollHeight;
      setAlturaTextarea(altura);
    };

    const EDT = elementDomTextarea.current;
    EDT.addEventListener("keyup", handler);

    return () => {
      EDT.removeEventListener("keyup", handler);
    };
  }, [alturaTextarea]);

  
  return (
    <div className="model-añadir-tarea">
      <form className="model-from-añadir-tarea"onSubmit={(e) => actualizarTarea(id,e) }>
        <div className="model-separador">
          <textarea
          value=""
            style={alturaTextarea ? { height: `${alturaTextarea}px` } : null}
            ref={elementDomTextarea}
            className="grupo-textarea"
            placeholder="escribir"
            onChange={(e) => setNewTarea(e.target.value)}
          ></textarea>
          <button className="from-añadir-tarea-btn" type="submit">enviar </button>
        </div>
        <input
          className="grupo-input"
          type="text"
          id="tiempo"
          onChange={(e) => setNewTiempo(e.target.value)}
        />
      </form>
    </div>
  );
};
