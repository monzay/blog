import React, { useCallback,useContext,useEffect, useState } from "react";
import { obtenerCredencialesUse } from "../App";
import { ComponenteActualizarTarea } from "./ComponenteActualizarTarea";
import { contextoTareas } from "../Contextos/ProviderTareas";
export const Tarea = ({ tarea, index }) => {

  const { tareaUser ,setTareauser} = useContext(contextoTareas)
  const [tareaId, setTareaId] =useState(0);
  const [todosLosTiemposTestantes,setTodosLosTiemposTestantes] = useState([])
  const [mostrarModelActualizar,setMostrarModelActualizar] = useState(false)

  async function eliminarTarea(tareaID) {
    try {
      //   datos especificos para eliminar la tarea
      const tareaUser = {
        idUser: obtenerCredencialesUse().idUser,
        tareaID: tareaID,
      };
      // peticion al servidor para que elimine la tarea
      const response = await fetch("http://localhost:3000/app/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tareaUser),
      });
      if (!response.ok) console.log("erro al resivir los datos");
      else {
        const data = await response.json();
        console.log("respuesta del servidor: ", data);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  }


  useEffect(() => {


    function sacarTiempoTareas(array) {
      
      function eliminarTodasLasInpuresasArrayTiempo(array){
        const arryLimpio =  array.filter(tiempo =>  Array.isArray(tiempo))
        return arryLimpio
      }


      function mapeamosElArraySepararLosTiempos(){
        
          const tiempos = array.map((tarea) => {
            if (tarea.tarea === "añadir") return null
             else return tarea.tiempo ? tarea.tiempo.split(":") : null;
          });
          return eliminarTodasLasInpuresasArrayTiempo(tiempos);
      }
      return mapeamosElArraySepararLosTiempos()
    }


    

    function sacarTiempoRestanteDeLasTareas() {
        // sacamo la hora actual 
      const date = new Date();
      const horaActual = date.getHours();
      const minutosActual = date.getMinutes();
      const arrayConLosTiempos = sacarTiempoTareas(tareaUser)

      setInterval(() => {
        
          const tiemposTareas = arrayConLosTiempos.map((tarea, index) => {
              const horaTarea =  parseInt(tarea[0]);
              const minutoTarea = parseInt(tarea[1]);
              
              // Calcular los minutos totales para la tarea y la hora actual
              const minutosTarea = horaTarea * 60 + minutoTarea;
              const minutosActuales = horaActual * 60 + minutosActual;

              // Calcular los minutos restantes
              let minutosFaltantes = minutosTarea - minutosActuales;
              if (minutosFaltantes < 0) {
                minutosFaltantes += 24 * 60; // Agrega 24 horas en minutos si la tarea ya pasó
              }

              // Calcular las horas y minutos restantes
              const HR = Math.floor(minutosFaltantes / 60);
              const MR = minutosFaltantes % 60;
              return [HR, MR];
             
            });
            setTodosLosTiemposTestantes(tiemposTareas)
      }, 1000);
    }
    sacarTiempoRestanteDeLasTareas()
  }, [tareaUser]);

useEffect(() => {
}, [todosLosTiemposTestantes])

  
  

  


  return (
    <div className="tarea" key={index}>
      { tarea.tareaID ===  tareaId  ?  <ComponenteActualizarTarea id={tareaId} /> :
      (
        <>
        <div className="tarea-contendor">
          <div className="tarea-contendor-info">
            <span className="tarea-tarea">{tarea.tarea}</span>
            <span>dias: 10</span>
            <span>TH: 21 </span>
            <span>TNH: 2 </span>
          </div>
          <div className="tarea-contenedor-btns">
            <button
              onClick={() => eliminarTarea(tarea.tareaID)}
              className="tarea-btn"
            ></button>
            <button
              onClick={() => {
               setMostrarModelActualizar(true)
               setTareaId(tarea.tareaID)
              }}
              className="tarea-btn"
            ></button>
          </div>
        </div>
        <div className="tarea-tiempo"> {
          tareaUser.map(t,index)
      } </div>
        <div className="tarea-tiempo"> {tarea.tiempo} </div>
      </>
   )
      }
    </div>
  );
};
