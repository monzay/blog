import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { calculateTaskDistribution } from "../funciones globales/distribuirTareasEnColumnas";
import { contextoEstadosCrudNotas } from "../Contextos/EstadosCrudNotas";


export const OccionesPrincipales = ({setDistribucionTareas}) => {


  
  const {dependenciasCrudNotas} = useContext(contextoEstadosCrudNotas)
  const [dependenciaMostrarNota,setDependenciaMostrarNota] = useState(false)
  const [dependenciaMostrarTarea,setDependenciaMostrarTarea] = useState(false)

  useEffect(() => {
    const notasLocales = JSON.parse(localStorage.getItem("notas"));
    if (!notasLocales) {
      localStorage.setItem("notas", JSON.stringify([{ tarea: "añadir nota" }]));
    }
  }, []);
  
  //------------------------------------------------------------------------------//
  // funcion que simula que cambia de seccion con un click 


  useEffect(() => {
    function mostrarNotasLocales (){
      const notasLocales = JSON.parse(localStorage.getItem("notas"));
      const notasCulumans = calculateTaskDistribution(notasLocales)
      setDistribucionTareas(notasCulumans)
    }
    mostrarNotasLocales()
  }, [dependenciaMostrarNota,dependenciasCrudNotas])
  
   //------------------------------------------------------------------------------//
  // funcion que simula que cambia de seccion con un click 

  useEffect(() => {
    function mostrarTareas (){
      const tareasLocales = JSON.parse( localStorage.getItem("tareas"))
      const tareaColumnas = calculateTaskDistribution(tareasLocales)
      setDistribucionTareas(tareaColumnas)
     }
    mostrarTareas()
  }, [dependenciaMostrarTarea])
  

  return (
 
    <div className="contenedor-btns-occiones">
      <div className="btn-occiones" onClick={()=>   setDependenciaMostrarNota(!dependenciaMostrarNota) }>notas</div>
      <div className="btn-occiones" onClick={()=> setDependenciaMostrarTarea(!dependenciaMostrarTarea)}>tareas</div>
    </div>
  );
};
