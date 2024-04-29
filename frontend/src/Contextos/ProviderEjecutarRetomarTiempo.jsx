import React, { createContext, useEffect, useState } from 'react'
import { RUTA_BACKEND } from '../../configuracion';

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
          const datoDeLaTarea = {
            tareaID: idLocal.id ,
            tareaHecha: 1,
            tareaNoHecha: 0,
          };
          
          const response = await fetch(`${RUTA_BACKEND}/app/seguimiento` , {
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
      function restarTiempo (horasRestantes,minutosRentes,Tid,ThoraEnLaQueComenzo){

        const interval = setInterval(() => {
          if (minutosRentes !== 0) {
            minutosRentes -= 1;
            setTiempoRestante({ horas: horasRestantes,minutos: minutosRentes,id:Tid,horaEnLaQueComenzo:ThoraEnLaQueComenzo});
          } else {
            if (horasRestantes !== 0) {
              horasRestantes -= 1;
              minutosRentes = 59;
              setTiempoRestante({ horas: horasRestantes,minutos: minutosRentes,id:Tid,horaEnLaQueComenzo:ThoraEnLaQueComenzo});
            } else {
              clearInterval(interval);
              mandarDarPuntoDeLaTareaCompletada();
              mandarIdParaNoMastrarLasTareasCompletadas();
            }
          }
        }, 1000);
      }
      function retomamosElTiempo() {
        const tiempo = JSON.parse(localStorage.getItem("tiempoRestanTarea"));

        if(tiempo){

          setTiempoRestante(tiempo)

          const Thoras = tiempo.horas
          const Tminutos = tiempo.minutos
          const Tid = tiempo.id
          const ThoraEnLaQueComenzo = tiempo.horaEnLaQueComenzo
         
          if(Thoras !== 0 || Tminutos !== 0  ){
            setId(Tid);
            let horaRetantes = Thoras;
            let minutosRentes = Tminutos;
            restarTiempo(horaRetantes,minutosRentes,Tid,ThoraEnLaQueComenzo);
          }

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
