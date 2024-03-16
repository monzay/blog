import React, { useState ,useEffect,useRef} from 'react';
import { obtenerCredencialesUse } from '../App';


export const AñadirTarea = () => {
  const [tarea, setTarea] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [alturaTextarea, setAlturaTextarea] = useState(0);
  const elementDomTextarea = useRef(null)



  async function mandarTarea () {
  
    try {
      const dataTarea ={
        idUser:obtenerCredencialesUse().idUser,
        tarea,
        tiempo
      }
          const response = await fetch("http://localhost:3000/app/enviar", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dataTarea),
          });
          if(response.ok){
            console.log("se emvio")

        }else{
          console.log("no se envio")
        }
      
        
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  };

  
  useEffect(() => {
    const handler = (event) => {
      let altura  = event.target.scrollHeight;
      setAlturaTextarea(altura)
    };

    const EDT = elementDomTextarea.current;
    EDT.addEventListener('keyup', handler);
    
    return () => {
      EDT.removeEventListener('keyup', handler);
    };
  }, [alturaTextarea]);


  return (
<div className='model-añadir-tarea'>
<form className="model-from-añadir-tarea" onSubmit={mandarTarea}>
  <div className='model-separador'>
  <textarea  
          style={alturaTextarea ?{height:`${alturaTextarea}px`} : null}
          ref={elementDomTextarea} 
          className='grupo-textarea' 
          placeholder='escribir' 
          value={tarea}
           onChange={(e) => setTarea(e.target.value)}
           ></textarea>
        <button className='from-añadir-tarea-btn' type="submit">enviar</button>
  </div>

        <input className='grupo-input' type="nun" id="tiempo" value={tiempo} onChange={(e) => setTiempo(e.target.value)} />
      </form>
</div>
  )
}