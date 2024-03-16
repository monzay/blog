import React, { useState, useEffect, useRef, useContext } from "react";
import { contextoTareas } from "../Contextos/ProviderTareas";

export const ComponenteActualizarTarea = ({id}) => {

  const {tareaUser} = useContext(contextoTareas)
  
 
  


  //estados 
  const [newTarea, setNewTarea] = useState("");
  const [newTiempo, setNewTiempo] = useState("");
  const [alturaTextarea, setAlturaTextarea] = useState(0);

  // TODOS LOS useRef()
  
  const elementDomTextarea = useRef(null);

  async function actualizarTarea(tareaID) {
    

    const oldTarea = tareaUser.find((t) => t.tareaID === tareaID);
    console.log(oldTarea)

    // creamos la nueva tarea
    const nuevaTarea = {
      ...oldTarea,
      tarea: newTarea ? newTarea : oldTarea.tarea,
      tiempo: newTiempo ? newTiempo : oldTarea.tiempo,
    };
    console.log(nuevaTarea)

    try {
      const response = await fetch("http://localhost:3000/app/actualizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaTarea),
      });
      if(response.ok) console.log("se mando ",response)
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
      <form
        className="model-from-añadir-tarea"
        onSubmit={() => actualizarTarea(id) }
      >
        <div className="model-separador">

          <textarea
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
