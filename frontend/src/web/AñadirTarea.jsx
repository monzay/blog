import React, { useState, useEffect, useRef, useContext } from "react";
import { obtenerCredencialesUse } from "../funciones globales/obtenenerDatosDelLocalStorage";
import { contextoEstadoEliminarTarea } from "../Contextos/EstadoEliminarTarea";
import iconAñadir from "../../public/Icons/añadir.svg";
import { RUTA_BACKEND } from "../../configuracion";

export const AñadirTarea = () => {
  const [tarea, setTarea] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [alturaTextarea, setAlturaTextarea] = useState(0);
  const elementDomTextarea = useRef(null);

  // PASAR A ESTE ESTADO DE UNA FORMA GLOABAL
  const [errorTarea, setErrorTarea] = useState("");
  const { setAñadirTarea, añadirTarea } = useContext(
    contextoEstadoEliminarTarea
  );

  async function mandarTarea(e) {
    e.preventDefault();

    const arraTime = tiempo.split(":")

    if (!tiempo) {
      setErrorTarea(
        "te falta el tiempo capo para eso te haces una nota no mas"
      );
      return;
    } else if (!tiempo.includes(":")) {
      setErrorTarea("che capo te falta : la estructura se veria 00:00 ");
      return;
    } else if (!tarea) {
      setErrorTarea("te falta la tarea capo");
      return;
    }else if(!isNaN(arraTime[0]) && !isNaN(arraTime[1])  && arraTime.length !== 2){
      setErrorTarea("estas poniendo algo mal en estructura pelotud@")
    } 
     else {
      try {
        const dataTarea = {
          idUser: obtenerCredencialesUse().idUser,
          tarea,
          tiempo,
        };
        const response = await fetch(`${RUTA_BACKEND}/app/enviar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataTarea),
        });
        if (response.ok) {
          setAñadirTarea(!añadirTarea);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    }
  }

  useEffect(() => {

    if(mostrarFormAñadir){

      const handler = (event) => {
        let altura = event.target.scrollHeight;
        setAlturaTextarea(altura);
      };
  
      const EDT = elementDomTextarea.current;
      
      EDT.addEventListener("keyup", handler);
      return () => {
        EDT.removeEventListener("keyup", handler);
      };
    }
  }, [alturaTextarea]);

  const [mostrarFormAñadir, setMostrarFromAñadir] = useState(false);

  return (
    <div className="model-añadir-tarea">
    {
      !mostrarFormAñadir && (  <div style={{width:"100%",padding:"35px 0px",display:"flex",justifyContent:"center"}} onClick={() => setMostrarFromAñadir(true)}>
      <img style={{height:"50px",  filter: "invert(100%) saturate(0)"}} src={iconAñadir} alt="" />
    </div>)
    }
      {mostrarFormAñadir && (
        <div>
          <form className="model-from-añadir-tarea" onSubmit={mandarTarea}>
            <div className="model-separador">
              <textarea
                style={
                  alturaTextarea ? { height: `${alturaTextarea}px` } : null
                }
                ref={elementDomTextarea}
                className="grupo-textarea"
                placeholder="escribir"
                value={tarea}
                onChange={(e) => setTarea(e.target.value)}
              ></textarea>
              <button className="from-añadir-tarea-btn" type="submit">
                enviar
              </button>
            </div>

            <input
              placeholder="tiempo"
              className="grupo-input"
              type="text"
              id="tiempo"
              onChange={(e) => setTiempo(e.target.value)}
            />
          </form>
          <span>{errorTarea} </span>
        </div>
      )}
    </div>
  );
};
