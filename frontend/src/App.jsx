import { useState, useEffect, useContext } from "react";
import "./app styles/app.css";
import React from "react";
import { Tarea } from "./web/Tarea";
import { HederOccion } from "./web/HederOccion";
import { OccionesPrincipales } from "./web/OccionesPrincipales";
import { AñadirTarea } from "./web/AñadirTarea";
import { contextoTareas } from "./Contextos/ProviderTareas";
import { ModelHoraDeLaTarea } from "./web/ModelHoraDeLaTarea";
import { ComponenteTodaslasTareaTops } from "./web/ComponenteTodaslasTareaTops";
import { obtenerCredencialesUse } from "./funciones globales/obtenenerDatosDelLocalStorage";
import { contextoEstadoEliminarTarea } from "./Contextos/EstadoEliminarTarea";
import { AñadirNota } from "./web/AñadirNota";
import { calculateTaskDistribution } from "./funciones globales/distribuirTareasEnColumnas";
import { Nota } from "./web/Nota";
import { fondoDePantalla } from "./diseños de pago/FondoDePantalla";
import { contextoEjecutarRetomarTiempo } from "./Contextos/ProviderEjecutarRetomarTiempo";
import { RUTA_BACKEND } from "../configuracion";
import { json } from "react-router-dom";


export const App = () => {
  //contextos
  const { tareaUser, setTareaUser } = useContext(contextoTareas);
  const { eliminoUnaTareas,añadirTarea,actualizoUnaTarea } = useContext(contextoEstadoEliminarTarea);
  const {todosLosIdsParaNoMostrar,setTodosLosIdsParaNoMostrar,envioElPunto} = useContext(contextoEjecutarRetomarTiempo)
  // estados
  const [tareaTops, setTareaTops] = useState([]);
  const [distribucionTareas, setDistribucionTareas] = useState([]);
  const [puntosTareas, setPuntosTareas] = useState([]);
  const [arrayConTodasLasTareasQueYaPasaronSuTiempo,setArrayConTodasLasTareasQueYaPasaronSuTiempo] = useState([]);
  const [idsTareaNoPletadas, setIdsTareaNoPletadas] = useState([]);
  const [mostrarTopOTareas, setMostrarTopOTareas] = useState({mostrasTareasTops: false,mostrarParaHacer: true,});
  
  const [tiempoFondoDePantalla,setTiempoFondoDePantalla] = useState(fondoDePantalla())


  //---------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------//
  
  // EFFECT  PARA CREAR UN ESPACION EN EL LOCALSTORAGE (IdTareasHechas)
  useEffect(() => {
    function crearEspacioEnLocalStorageIdTareasHechas(){
      const date = new Date()
      const dia = date.getDay()
      const exite  = JSON.parse( localStorage.getItem("IdTareasHechas"))
      if(!exite ) localStorage.setItem("IdTareasHechas",JSON.stringify([{ids:[],dia}]))
    }
    crearEspacioEnLocalStorageIdTareasHechas()
  }, [])
 //---------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------//

  // EFFECT  PARA OBTENER TODOS LOS IDS ALMACENADOS DURANTE EL DIA  PARA NO MOSTRAR 
  useEffect(() => {
    function obtenerLosIdTareaQueYaFueronCompletadaDuranteDia(){
      const dataLocal = JSON.parse(localStorage.getItem("IdTareasHechas"));
      if (dataLocal) {
        setTodosLosIdsParaNoMostrar(dataLocal[0].ids);
      }
    }
    obtenerLosIdTareaQueYaFueronCompletadaDuranteDia()
  }, []);




  useEffect(() => {
    if (!localStorage.getItem("tiemposTareas")) {
      localStorage.setItem("tiemposTareas", JSON.stringify({}));
    }
  }, []);

  
  //---------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------//


  useEffect(() => {
    if(!localStorage.getItem("tareaMostrar")){
      localStorage.setItem("tareaMostrar",JSON.stringify([]))
    }
  }, [])
  


  // METE TODOS LOS IDS AL LOCALSTORAGE ACADA 1 MINUTO
  useEffect(() => {
    localStorage.setItem("tareaMostrar",JSON.stringify(arrayConTodasLasTareasQueYaPasaronSuTiempo))
  }, [arrayConTodasLasTareasQueYaPasaronSuTiempo])
  

  //---------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------//






  // EFECTO  
  useEffect(() => {
    // FUNCION  PARA NO MOSTRAR LA TAREA QUE YA FUE COMPLETADA 

    function verSiLaTareaNoSeTieneQueMostrar() {
      const arrayIdsNoMostrar = todosLosIdsParaNoMostrar;
      const arrayIds = arrayConTodasLasTareasQueYaPasaronSuTiempo;
      for (let i = 0; i < arrayIdsNoMostrar.length; i++) {
        const bool = arrayIds.includes(arrayIdsNoMostrar[i]);
        if (bool) {
          const index = arrayIds.indexOf(arrayIdsNoMostrar[i]);
          if (index !== -1) {
            arrayIds.splice(index, 1);
          }
        }
      }
      return arrayIds;
    }
    setIdsTareaNoPletadas(verSiLaTareaNoSeTieneQueMostrar());
  }, [arrayConTodasLasTareasQueYaPasaronSuTiempo, todosLosIdsParaNoMostrar]);

  // CONCATEMOS EL ARRAY CON LOS IDS CON LOS IDS DE  TAREAADELANTAR PARA MOSTRAR LAS TAREAS QUE SE TIENEN QUE HACER AUN  



  useEffect(() => {
    const array1 = JSON.parse(localStorage.getItem("tiemposTareas"))
    const ids_no_mostrar = JSON.parse(localStorage.getItem("IdTareasHechas"))[0].ids
    if(Object.keys(array1).length !== 0 && !ids_no_mostrar.includes(array1.id)){
      setTimeout(() => {
         setArrayConTodasLasTareasQueYaPasaronSuTiempo(prev=> [...prev,array1.id])
      }, 1000);
    }
  }, [])






  //---------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------//

  useEffect(() => {
    const tareasUsuarioEnCulmnas = calculateTaskDistribution(tareaUser)
    setDistribucionTareas(tareasUsuarioEnCulmnas);

  }, [tareaUser]);
  //---------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------//

  // OBETNEMOS TODAS LAS TAREAS DEL SERVIDOR , HISTORIAL , TAREA TOPS 
  async function obtenerTareasUserYTareasTops() {
    try {
      const response = await fetch(`${RUTA_BACKEND}/app` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser: obtenerCredencialesUse().idUser }),
      });
      // si hay una respuesta se obtiene todas las tareas
      if (response.ok) {
        const tareas = await response.json();
        const todasLasTareas = tareas.tareasID;
        todasLasTareas.push({ tarea: "añadir" });
        localStorage.setItem("tareas", JSON.stringify(todasLasTareas));
        return {
          tareas: todasLasTareas,
          tareasTops: tareas.tareasTops,
          puntosTareas: tareas.puntosTareas,
        };
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  }
   //---------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------//

  // EFFECT QUE TIENE EL CONTROL DE TODOS LOS CAMBIO DE LAS TAREAS QUE SE ESTAN LLAMANDO DE LA API 
  useEffect(() => {
    async function s() {
      const { tareasTops, tareas, puntosTareas } = await obtenerTareasUserYTareasTops();
      setTareaUser(tareas);
      setPuntosTareas(puntosTareas);
      setTareaTops(tareasTops);
    }
    s();
    

  }, [eliminoUnaTareas,envioElPunto,añadirTarea,actualizoUnaTarea]);



  //---------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------//
  return (
    <div className="app">
      <div className="header-icon-menu"></div>
      <header>
        <section className="header-seccion-menu">
          <div className="header-menu-occiones">
            <HederOccion occion="perfil" />
            <HederOccion occion="pago" />
            <HederOccion occion="ajustes" />
            <HederOccion occion="estadisticas" />
          </div>
        </section>
      </header>
      <main>
        <section className="seccion-tareas">
          <div className=" contedor-tareas">
            {[0, 1, 2].map((culumna) => (
              <div key={culumna} className="culmna">
                {distribucionTareas[culumna]
                  ? distribucionTareas[culumna].map((tarea) => {
                      if (tarea.tarea === "añadir") return <AñadirTarea />;
                      
                      else if (tarea.tarea === "añadir nota")
                        return <AñadirNota />;
                      else if (tarea.tipo == "nota")
                        return <Nota nota={tarea} />;
                      else {
                        return (
                          <Tarea
                            setTiempoFondoDePantalla={setTiempoFondoDePantalla}
                            puntosTareas={puntosTareas}
                            tarea={tarea}
                            setArrayConTodasLasTareasQueYaPasaronSuTiempo={
                              setArrayConTodasLasTareasQueYaPasaronSuTiempo
                            }
                            arrayConTodasLasTareasQueYaPasaronSuTiempo={
                              arrayConTodasLasTareasQueYaPasaronSuTiempo
                            }
                            
                            todosLosIdsParaNoMostrar={todosLosIdsParaNoMostrar}
                          />
                        );
                      }
                    })
                  : null}
              </div>
            ))}
          </div>
        </section>
        <section className="seccion-usuarios-tops">
          <div className="contendor-mostrar-tareaTop-y-tareas">
            {mostrarTopOTareas.mostrasTareasTops && (
              <ComponenteTodaslasTareaTops tareaTops={tareaTops} />
            )}
            {mostrarTopOTareas.mostrarParaHacer && (
              <ul className="contenedor-mostrar-las-tarea-para-hacer">
                {idsTareaNoPletadas &&
                  idsTareaNoPletadas.map((data) => (
                    <ModelHoraDeLaTarea
                      data={data}
                    />
                  ))}
              </ul>
            )}
          </div>
          <div className="contenedor-seccion-mostrar-hora-de-hacer-la-tarea ">
            <div
              onClick={() => {
                setMostrarTopOTareas({
                  mostrasTareasTops: true,
                  mostrarParaHacer: false,
                });
              }}
              className="btn-seccion-mostrar-hora-de-hacer-la-tarea"
            >
              <span>top</span>
            </div>
            <div
              onClick={() => {
                setMostrarTopOTareas({
                  mostrasTareasTops: false,
                  mostrarParaHacer: true,
                });
              }}
              className="btn-seccion-mostrar-hora-de-hacer-la-tarea"
            >
              <span>tareas</span>
            </div>
          </div>
        </section>
        <div className="fondo-de-pantalla">
         <div className="fonodo-tiempo">
        {tiempoFondoDePantalla}
         </div>
        </div>
        <OccionesPrincipales setDistribucionTareas={setDistribucionTareas} />
      </main>
    </div>
  );
};
