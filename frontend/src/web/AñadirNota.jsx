import React, { useContext, useState ,useRef,useEffect} from "react";
import { contextoEstadosCrudNotas } from "../Contextos/EstadosCrudNotas";
import iconAñadir from "../../public/Icons/añadir.svg"

export const AñadirNota = () => {




  const {setDependenciasCrudNotas} = useContext(contextoEstadosCrudNotas)
  const [nota, setNota] = useState("");
  const [alturaTextarea, setAlturaTextarea] = useState(0);
  const elementDomTextarea = useRef(null);
//---------------------------------------------------------------------//
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



//---------------------------------------------------------------------//
  // EFFECT QUE AGRANDA EL HEIGTH DE TEXTARIA 
  useEffect(() => {
    if(alturaTextarea){
      const handler = (e) => {
        let altura = e.target.scrollHeight;
        setAlturaTextarea(altura);
      };
      const EDT = elementDomTextarea.current;
      EDT.addEventListener("keyup", handler);
      return () => {
        EDT.removeEventListener("keyup", handler);
      };
    }
  }, [alturaTextarea]);


  const [mostrarAñadirNota,setMostrarAñadirNota] = useState(false)
  return (

    <div className="model-añadir-tarea">
      {
        mostrarAñadirNota ? (
          <form className="model-from-añadir-tarea" onSubmit={(e) => añadirNota(e) }>
          <div className="model-separador">
            <textarea
              style={alturaTextarea ? { height: `${alturaTextarea}px` } : null}
              ref={elementDomTextarea}
              className="grupo-textarea"
              placeholder="escribir"
              onChange={(e) => setNota(e.target.value)}
            ></textarea>
            <button className="from-añadir-tarea-btn" type="submit">enviar </button>
          </div>
        </form>
        ):
        (<div className="contenedor-icon-añadir-nota">
           <img  className="icons-añadir-nota"  src={iconAñadir} onClick={() => setMostrarAñadirNota(true)} alt="" />
        </div>)
      }
    </div>

   
  );
};
