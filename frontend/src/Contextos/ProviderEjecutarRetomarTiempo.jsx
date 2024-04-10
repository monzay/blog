import React, { createContext, useEffect, useState } from 'react'

export const contextoEjecutarRetomarTiempo = createContext();
export const ProviderEjecutarRetomarTiempo = ({children}) => {


    const [tiempoRestante, setTiempoRestante] = useState({horas: 0,minutos: 0,id: 0,horaEnLaQueComenzo: "",});
    const [id, setId] = useState(0);
    const [indentificador,setIndentificador ]= useState({tiempoDeclado:false,retomarTiempo:false })
    const [todosLosIdsParaNoMostrar,setTodosLosIdsParaNoMostrar] = useState([])
    const [envioElPunto,setEnvioElPunto] = useState(false)




    // TODAS ESTA FUNCIONES SON PARA QUE SE EJECUTE LA FUNCION PARA RETOMAR EL TIEMPO  DEL LOCALSTORAGE
    // FUNCION PARA MANDAR EL PUNTO  CUADNO RETOMAMOS EL TIEMPO 
      async function mandarDarPuntoDeLaTareaCompletada() {
        try {
          const idLocal = JSON.parse(localStorage.getItem("tiempoRestanTarea"))
          // revisar 
          const datoDeLaTarea = {
            tareaID: idLocal.id ,
            tareaHecha: 1,
            tareaNoHecha: 0,
          };
          
          const response = await fetch("http://localhost:3000/app/seguimiento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datoDeLaTarea),
          });
          const data = await response.json();
          if(response.ok) console.log(data)
        setEnvioElPunto(!envioElPunto);
        } catch (error) {
          console.error("Error al obtener los datos:", error.message);
        }
      }
      function mandarIdParaNoMastrarLasTareasCompletadas() {
    
        const dataLocal = JSON.parse(localStorage.getItem("IdTareasHechas"));
        const  x =  JSON.parse(localStorage.getItem("tiempoRestanTarea"));
        const id = x.id 
        
        setTodosLosIdsParaNoMostrar((prev) => [...prev, id]);
        const newData = {
          ...dataLocal[0],
          ids:[...dataLocal[0].ids,id],
        };
        localStorage.setItem("IdTareasHechas", JSON.stringify([newData]));
    
      }
      function restarTiempo (horasRestantes,minutosRentes){
        const interval = setInterval(() => {
          if (minutosRentes !== 0) {
            minutosRentes -= 1;
            setTiempoRestante((prev) => ({...prev, horas: horasRestantes,minutos: minutosRentes}));
          } else {
            if (horasRestantes !== 0) {
              horasRestantes -= 1;
              minutosRentes = 59;
              setTiempoRestante((prev) => ({...prev,horas: horasRestantes,minutos: minutosRentes,}));
            } else {
              clearInterval(interval);
              mandarDarPuntoDeLaTareaCompletada();
              mandarIdParaNoMastrarLasTareasCompletadas();
            }
          }
        }, 60000);
      }
      function retomamosElTiempo() {

        const tiempo = JSON.parse(localStorage.getItem("tiempoRestanTarea"));
        if(tiempo.horas !== 0 || tiempo.minutos !== 0  ){
          setId(tiempo.id)
          let horaRetantes = tiempo.horas;
          let minutosRentes = tiempo.minutos;
          restarTiempo(horaRetantes,minutosRentes)
        }
      }
      useEffect(() => {
        retomamosElTiempo()
      }, [])


  return (
    <contextoEjecutarRetomarTiempo.Provider
    value={{tiempoRestante,setTiempoRestante,setId,id,indentificador,setIndentificador,todosLosIdsParaNoMostrar,setTodosLosIdsParaNoMostrar,setEnvioElPunto,envioElPunto}}
  >
    {children}
  </contextoEjecutarRetomarTiempo.Provider>
  )
}
