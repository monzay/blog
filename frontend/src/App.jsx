import { useState, useEffect, useContext } from "react";
import "./app styles/app.css";
import React from "react";
import { Tarea } from "./web/Tarea";
import { HederOccion } from "./web/HederOccion";
import { OccionesPrincipales } from "./web/OccionesPrincipales";
import { AñadirTarea } from "./web/AñadirTarea";
import { ComponenteTareaTop } from "./web/ComponenteTareaTop";
import { contextoTareas } from "./Contextos/ProviderTareas";

export function obtenerCredencialesUse() {
  const credencialesLocalStore = JSON.parse(
    localStorage.getItem("credenciales")
  );
  return credencialesLocalStore;
}
export const App = () => {


 const {tareaUser,setTareaUser} = useContext(contextoTareas)

 
  const [tareaTops, setTareaTops] = useState([]);
  const [distribucionTareas, setDistribucionTareas] = useState([]);
 


  // todos las funciones
  function obetnerTareaLocales() {
    const tareasLocales = JSON.parse(localStorage.getItem("tareas"));
    return tareasLocales;
  }

  // function ObtenerTodosLosTiemposTareasEnArray(array) {
  //   const todosLosTiempos = array.map((t) => {
  //     const tiemposArrays = t.tiempo.split(":");
  //     return tiemposArrays;
  //   });
  //   return todosLosTiempos;
  // }

  // function calcularTodosLosTiempos() {
  //   setInterval(() => {
  //     const date = new Date();
  //     const horaActual = date.getHours();
  //     const minutosActual = date.getMinutes();

  //     let TiempoRestanteTareas = ObtenerTodosLosTiemposTareasEnArray(
  //       tareaUser
  //     ).map((tarea) => {
  //       const horaTarea = tarea[0];
  //       const minutoTarea = tarea[1];

  //       // Calcular los minutos totales para la tarea y la hora actual
  //       const minutosTarea = horaTarea * 60 + minutoTarea;
  //       const minutosActuales = horaActual * 60 + minutosActual;

  //       // Calcular los minutos restantes
  //       let minutosFaltantes = minutosTarea - minutosActuales;
  //       if (minutosFaltantes < 0) {
  //         minutosFaltantes += 24 * 60; // Agrega 24 horas en minutos si la tarea ya pasó
  //       }

  //       // Calcular las horas y minutos restantes
  //       const horasRestantes = Math.floor(minutosFaltantes / 60);
  //       const minutosRestantes = minutosFaltantes % 60;

  //       return [horasRestantes, minutosRestantes];
  //     });

  //     return TiempoRestanteTareas;
  //   }, 600000);
  // }

  // todos useEffect

  // actualizamos la hora de todas las tareas


  useEffect(() => {
    function calculateTaskDistribution(tarea) {
      const taskDistribution = distributeTasks(tarea, 3, [[], [], []]);
      return taskDistribution;

      // const widthWindow = window.innerWidth;
      // let taskDistribution = [];

      // if (widthWindow > 1000) {
      //   taskDistribution = distributeTasks(tasks, 3, [[], [], []]);
      // }
      // return taskDistribution;
    }

    function distributeTasks(tasks, columns, array) {
      const distributedTasks = array;
      for (let i = 0; i < tasks.length; i++) {
        const columnIndex = i % columns;
        distributedTasks[columnIndex].push(tasks[i]);
      }
      return distributedTasks;
    }

    const distributedTasks = calculateTaskDistribution(tareaUser);
    setDistribucionTareas(distributedTasks);
  }, [tareaUser]);

  useEffect(() => {
    const obtenerDatosUser = async () => {
      try {
        // si hay tareas locales  se saca las tareas locales
        if (!obetnerTareaLocales()) {
          setTareaUser(obetnerTareaLocales());
        }
        // si no hay tareas locales se hace la peticion
        else {
          // si o si se tiene que obtener las credenciales de localstarage
          if (obtenerCredencialesUse()) {
            const response = await fetch("http://localhost:3000/app", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idUser: obtenerCredencialesUse().idUser }),
            });
            // si hay una respuesta se obtiene todas las tareas
            if (response.ok) {
              const { tareasTops, tareasID } = await response.json();
              const todasLasTareas = tareasID;
              todasLasTareas.push({ tarea: "añadir" });
              setTareaUser(todasLasTareas);
              setTareaTops(tareasTops);
            }
            // en caso contrario se devuelve un mensaje de error
            else {
              console.log("no se pudieron mandar los datos");
            }
          } else {
            console.log("aun no estan las credenciales locales");
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    };
    obtenerDatosUser();
  }, []);













  


  //funciones que se tiene que probar ya que no se si funcinan no tengo internet

  const [seguimientoTarea, setSeguimientoTarea] = useState({
    noHecha: 0,
    hecha: 0,
  });

  async function mandarDarPuntoDeLaTareaCompletada() {
    try {
      const datoDeLaTarea = {
        idUser: obtenerIdUser().idUser,
        tareaID: 12,
        hecha: seguimientoTarea.hecha,
        noHecha: seguimientoTarea.noHecha,
      };

      const response = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datoDeLaTarea),
      });

      if (response.ok) {
      } else {
        console.log("no se pudieron mandar los datos");
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  }
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
                  ? distribucionTareas[culumna].map((tarea,index) => {
                      if (tarea.tarea === "añadir") {
                        return <AñadirTarea />;
                      } else {
                        return <Tarea index={index} tarea={tarea}  />;
                      }
                    })
                  : null}
              </div>
            ))}
          </div>
        </section>
        <section className="seccion-usuarios-tops">
          <ComponenteTareaTop />
          <ul className="contedor-tareas-tops">
            <li className="tareas-tops">
              <div>
                <div className="informacion-tarea-top">
                  <span className="tarea-top-nombre">joel</span>
                  <span className="tarea-top-mensaje">
                    hola gente como se llaman
                  </span>
                  <span className="tarea-top-puntos">puntos:</span>
                </div>
              </div>
            </li>
            <li className="tareas-tops">
              <div>
                <div className="informacion-tarea-top">
                  <span className="tarea-top-nombre">joel</span>
                  <span className="tarea-top-mensaje">
                    hola gente como se llaman
                  </span>
                  <span className="tarea-top-puntos">puntos:</span>
                </div>
              </div>
            </li>
          </ul>
        </section>
        <OccionesPrincipales />
      </main>
    </div>
  );
};
