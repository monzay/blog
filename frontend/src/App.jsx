import { useState, useEffect, useContext, useTransition } from "react";
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


export const App = () => {
  //contextos
  const { tareaUser, setTareaUser } = useContext(contextoTareas);
  const { eliminoUnaTareas,añadirTarea,actualizoUnaTarea } = useContext(contextoEstadoEliminarTarea);

  // estados
  const [envioElPunto, setEnvioElPunto] = useState(false);
  const [tareaTops, setTareaTops] = useState([]);
  const [distribucionTareas, setDistribucionTareas] = useState([]);
  const [puntosTareas, setPuntosTareas] = useState([]);
  const [arrayConTodasLasTareasQueYaPasaronSuTiempo,setArrayConTodasLasTareasQueYaPasaronSuTiempo] = useState([]);
  const [todosLosIdsParaNoMostrar, setTodosLosIdsParaNoMostrar] = useState([]);
  const [idsTareaNoPletadas, setIdsTareaNoPletadas] = useState([]);
  const [mostrarTopOTareas, setMostrarTopOTareas] = useState({mostrasTareasTops: false,mostrarParaHacer: true,});
  

  
  
  const [tiempoFondoDePantalla,setTiempoFondoDePantalla] = useState(fondoDePantalla())
  //---------------------------------------------------------------------------------------------------//
  useEffect(() => {
    const dataLocal = JSON.parse(localStorage.getItem("IdTareasHechas"));
    if (dataLocal) {
      setTodosLosIdsParaNoMostrar(dataLocal[0].ids);
    }
  }, []);

  //---------------------------------------------------------------------------------------------------//
  useEffect(() => {
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
  //---------------------------------------------------------------------------------------------------//
  useEffect(() => {
    const tareasUsuarioEnCulmnas = calculateTaskDistribution(tareaUser)
    setDistribucionTareas(tareasUsuarioEnCulmnas);
  }, [tareaUser]);
  //---------------------------------------------------------------------------------------------------//

  // falta agregar la dependencia dea actualizar
  useEffect(() => {
    async function s() {
      const { tareasTops, tareas, puntosTareas } =
        await obtenerTareasUserYTareasTops();
      setTareaUser(tareas);
      setPuntosTareas(puntosTareas);
      setTareaTops(tareasTops);
    }
    s();
  }, [eliminoUnaTareas,envioElPunto,añadirTarea,actualizoUnaTarea]);

  async function obtenerTareasUserYTareasTops() {
    try {
      const response = await fetch("http://localhost:3000/app", {
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
      // en caso contrario se devuelve un mensaje de error
      else {
        console.log("no se pudieron mandar los datos");
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  }
  //---------------------------------------------------------------------------------------------------//
  return (
    <div className="app">
      <div className="header-icon-menu"></div>
      <header>
        <section className="header-seccion-menu">
          <div className="header-menu-occiones">
            <HederOccion occion="premion" />
            <HederOccion occion="ajustes" />
            <HederOccion occion="pago" />
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
              <ul>
                {idsTareaNoPletadas &&
                  idsTareaNoPletadas.map((data) => (
                    <ModelHoraDeLaTarea
                      data={data}
                      setEnvioElPunto={setEnvioElPunto}
                      envioElPunto={envioElPunto}
                      setTodosLosIdsParaNoMostrar={setTodosLosIdsParaNoMostrar}
                      todosLosIdsParaNoMostrar={todosLosIdsParaNoMostrar}
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
