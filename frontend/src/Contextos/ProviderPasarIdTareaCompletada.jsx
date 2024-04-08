import React from "react";
import { useState, createContext, useEffect } from "react";

export const contextoPasarIdTareaCompletada = createContext();

export const ProviderPasarIdTareaCompletada = ({ children }) => {

  const [idTareaHecha, setIdTareaHecha] = useState(0);
  

  // EFECTO PARA VER SI EXITE EL ESPACIO EN EL LOCALSTORAGE Y NO LO CRAMOS  
  useEffect(() => {
    // VEMOS SI EXITE EL ESPACION EN EL LOCALSTORAGE
    const dataLocal = localStorage.getItem("IdTareasHechas")
    // SI NO EXITE LO CREAMOS  
    if (!dataLocal) {
      const date = new Date()
      const dia = date.getDay()
      // ESTRUCTURA BASE CON EL DIA ACTUAL 
      localStorage.setItem("IdTareasHechas",JSON.stringify([{ ids: [], dia}]));
    }
  }, [])


  useEffect(() => {



    const date =  new Date()
    const dia = date.getDay()
    const horas = date.getHours(); 
    const minutos = date.getMinutes()

    // SUB FUNCION 
   function eliminarLasTareasQueSeCompletaronDuranteElDiaYQueDarmeConLasQueFueronCompletadas() {
    
    const ids = JSON.parse(localStorage.getItem("IdTareasHechas"))
    let tareas = JSON.parse(localStorage.getItem("tareas"))
    
    const allIds = tareas.map(t => t.tareaID).filter(id => typeof id === "number");
    
    const idsHechos = ids[0].ids
    let todosLosIsd = allIds 

    for (let i = 0; i < idsHechos.length; i++) {
      const num = idsHechos[i];
      const index = todosLosIsd.indexOf(num);
      if (index !== -1) {
        todosLosIsd.splice(index, 1); 
      }
    }

    return todosLosIsd 
   }
    // SUB FUNCION
    function mandarPuntoTareaNoHecha() {
        const  arrayIds = eliminarLasTareasQueSeCompletaronDuranteElDiaYQueDarmeConLasQueFueronCompletadas()
        for (let i = 0; i < arrayIds.length ; i++) {
          POST(arrayIds[i])
        }

      async function POST (idTarea){
        try {
          const datoDeLaTarea = {
            tareaID: idTarea,
            tareaEcha: 0,
            tareaNoEcha: 1,
          };
          
          const response = await fetch("http://localhost:3000/app/seguimiento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datoDeLaTarea),
          });
          const data = await response.json();
        } catch (error) {
          console.error("Error al obtener los datos:", error.message);
        }
      }
    }
    // SUB FUNCION 
    function procesamiento (){
      // OBTENEMOS LOS IDS 
      const diaLocal = JSON.parse(localStorage.getItem("IdTareasHechas"))
      if(dia !== diaLocal[0].dia){
        // ESTA FUNCION EJECUTA UN FOR QUE RECORRE TODO  Y MANDA UN POST DE QUE NOSE HICIERON LAS TAREAS DURANTE EL DIA 
        mandarPuntoTareaNoHecha()
        // ELIMINAMOS TODOS LOS IDS DE LAS TAREAS
        localStorage.setItem("IdTareasHechas",JSON.stringify([{...diaLocal[0],ids:[]}]))
      }
    }
    procesamiento()
    
    // FUNCION PRINCINPAL
    function eliminarLosIdsDiariamente (){
    // CALCULAMOS CUANDO FALTA QUE SEAN LAS 00:00 
    
    let tiempoHastaLas12 = 0;
    if (dia === 0) tiempoHastaLas12 = 24 * 60 * 60 * 1000; 
    else tiempoHastaLas12 =  Math.abs(horas - 24) * 60 * 1000 -  Math.abs(minutos - 60) * 1000 
    //SE VA A EJECUTAR A LAS 00:00
    setTimeout(() => {
     procesamiento()
     // EN EL MISMO INTANTE ARRANCAMOS CON EL INTERVALO CADA 24H PARA NO ESTA EJECUTANDO A CADA 1MIN
     setInterval(() => {
       procesamiento()
     }, 24 * 60 * 60 * 1000 ); 
   }, tiempoHastaLas12); 
    }
    // DECLARACION 
    
   eliminarLosIdsDiariamente()
  }, [])
  


  return (
    <contextoPasarIdTareaCompletada.Provider
      value={{ setIdTareaHecha, idTareaHecha }}
    >
      {children}
    </contextoPasarIdTareaCompletada.Provider>
  );
};
