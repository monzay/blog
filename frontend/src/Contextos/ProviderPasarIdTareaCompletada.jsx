import React from "react";
import { useState, createContext, useEffect } from "react";

export const contextoPasarIdTareaCompletada = createContext();

export const ProviderPasarIdTareaCompletada = ({ children }) => {

  const [idTareaHecha, setIdTareaHecha] = useState(0);
  const [diaActual, setDiaActual] = useState(0);
  



  useEffect(() => {
    setInterval(() => {
      cuardarTodasLosIdTareasCompletada();
    }, 60000);
  }, [diaActual]);

  useEffect(() => {
    const dataLocal = JSON.parse(localStorage.getItem("IdTareasHechas"));
    if (!dataLocal) {
      localStorage.setItem(
        "IdTareasHechas",
        JSON.stringify([{ ids: [], dia: setDiaActual }])
      );
    }
  }, [])

   function mandarPuntoTareaNoHecha() {



    const disLocales = JSON.parse(localStorage.getItem("IdTareasHechas"))
    const  arrayIds = disLocales[0].ids
    console.log(arrayIds)
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
  function cuardarTodasLosIdTareasCompletada() {
    // datos del dia
    const data = new Date();
    const hora = data.getHours();
    const minutos = data.getMinutes();
    const dia = data.getDay();
    // guadamos el dia  
    setDiaActual(dia);
    
    // calculamos las la hora como los minutos para que se le agrege el 0 ya que solo retornan un solo numero 
    let tiempoActual = null;
    if (minutos <= 9) tiempoActual = `${hora}:0${minutos}`;
    else tiempoActual = `${hora}:${minutos}`;
    // se va eliminar todos los dias
     const dataLocal = JSON.parse(localStorage.getItem("IdTareasHechas"))
    if (tiempoActual === "00:00" || dia !== dataLocal[0].dia) {
      mandarPuntoTareaNoHecha()
      localStorage.removeItem("IdTareasHechas");
      localStorage.setItem("IdTareasHechas", JSON.stringify([{ ids: [], dia: dia }]))
    }
  }
  

  return (
    <contextoPasarIdTareaCompletada.Provider
      value={{ setIdTareaHecha, idTareaHecha }}
    >
      {children}
    </contextoPasarIdTareaCompletada.Provider>
  );
};
