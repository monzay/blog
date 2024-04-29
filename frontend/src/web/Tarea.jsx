import React, { useContext, useEffect, useState, version } from "react";
import { ComponenteActualizarTarea } from "./ComponenteActualizarTarea";
import { obtenerCredencialesUse } from "../funciones globales/obtenenerDatosDelLocalStorage";
import { contextoEstadoEliminarTarea } from "../Contextos/EstadoEliminarTarea";
import { fondoDePantalla } from "../diseños de pago/FondoDePantalla";
import iconEliminar from "../../public/Icons/eliminar.svg";
import iconEditar from "../../public/Icons/editar.svg";
import { RUTA_BACKEND } from "../../configuracion";
import { comenzarTarea } from "../acciones/comenzarTarea";
import { contextoTareas } from "../Contextos/ProviderTareas";
import { eliminar_id_tarea_adelantada } from "../acciones/eliminarIdTareaAdelantada";


export const Tarea = ({
  tarea,
  puntosTareas,
  setArrayConTodasLasTareasQueYaPasaronSuTiempo,
  setTiempoFondoDePantalla,
}) => {
  // [tarea]: nos retorna todas las tareas

  const { eliminoUnaTareas, setEliminoUnaTarea } = useContext(
    contextoEstadoEliminarTarea
  );

  const {tareaUser} = useContext(contextoTareas)
  const [tareaId, setTareaId] = useState(0);
  const [mostrarModelActualizar, setMostrarModelActualizar] = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date());
  const [tiempoRestante, setTiempoRestante] = useState("");






  //------------------------------------------------------------------------//
  // vinculamos los puntos con las tareas
  function VincularLosPuntos() {
    const TareaPuntos = puntosTareas.find((TP) => TP.tareaID === tarea.tareaID);
    return TareaPuntos;
  }
  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//
  async function eliminarTarea(tareaID) {
    try {
      //   datos especificos para eliminar la tarea
      const tareaUser = {
        idUser: obtenerCredencialesUse().idUser,
        tareaID: tareaID,
      };
      // peticion al servidor para que elimine la tarea
      const response = await fetch(`${RUTA_BACKEND}/app/eliminar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tareaUser),
      });
      if (!response.ok) console.log("erro al resivir los datos");
      else {
        const data = await response.json();
        setEliminoUnaTarea(!eliminoUnaTareas);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  }
  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//
  function verSiLaTareaLlegoASuHoraDeDestino() {
    function verSiElTiempoLlego() {
      const tiempo = tarea.tiempo;
      const [targetHours, targetMinutes] = tiempo.split(":"); // Divide la cadena en horas y minutos
      const targetDate = new Date(currentHour); // Crea una nueva instancia de Date basada en la hora actual
      targetDate.setHours(parseInt(targetHours)); // Establece las horas objetivo
      targetDate.setMinutes(parseInt(targetMinutes)); // Establece los minutos objetivo
      return currentHour >= targetDate; // Compara la hora actual con la hora objetivo
    }
    // si la hora llego  a su tiempo o se paso
    if (verSiElTiempoLlego()) {
      const id = tarea.tareaID;
      setArrayConTodasLasTareasQueYaPasaronSuTiempo((prev) =>
        prev.includes(id) ? prev : [...prev, id]
      );
    }
  }
  // se va a ejecutar una sola vez  para que se muestren todas  las tarea que se tienen que hacer
  // hasta que se ejecuta la misma funcion pero cada 1min
  useEffect(() => {
    verSiLaTareaLlegoASuHoraDeDestino();
  }, []);
  //------------------------------------------------------------------------//
  function calcularCuantoTiempoRestanteLeQueda(hora) {
    if (hora) {
      // hora actual
      const date = new Date();
      const horaActual = date.getHours();
      const minutosActual = date.getMinutes();
      // pasamos el astrin a un array divido por :
      const [h, m] = hora.split(":");
      //nos aseguramos  que sean numero
      const horaNumber = parseInt(h);
      const minutoNumber = parseInt(m);
      // Calcular los minutos totales para la tarea y la hora actual
      const minutosTarea = horaNumber * 60 + minutoNumber;
      const minutosActuales = horaActual * 60 + minutosActual;
      // Calcular los minutos restantes
      let minutosFaltantes = minutosTarea - minutosActuales;
      if (minutosFaltantes < 0) {
        minutosFaltantes += 24 * 60; // Agrega 24 horas en minutos si la tarea ya pasó
      }
      // Calcular las horas y minutos restantes
      const HR = Math.floor(minutosFaltantes / 60);
      const MR = minutosFaltantes % 60;
      const tiempoRestante = `${HR}:${MR}`;
      return tiempoRestante;
    }
  }
  //------------------------------------------------------------------------//
  function eliminarTodosLosIdsAlmacenadosCuandonSeaOtroDia() {
    const date = new Date();
    const dia = date.getDay();
    const dataLocal = JSON.parse(localStorage.getItem("IdTareasHechas"));
    if (dataLocal) {
      if (dataLocal[0].dia !== dia) {
        console.log("hola como estas");
        localStorage.removeItem("IdTareasHechas");
      }
      // mesansaje : cuando se elimine el almacenamiento se va tener que resfrescar para que se vuelva a crear el almacenamiento por que si no donde se van mandar los ids
    }
  }
  // futura useEffet para que todas las cosas relacionadas con el tiempo para solo tener un solo pucle y que todo dependa de uno
  useEffect(() => {
    //----------------------------------------------------------------------//
    setTiempoRestante(calcularCuantoTiempoRestanteLeQueda(tarea.tiempo));
    //----------------------------------------------------------------------//
    const interval = setInterval(() => {
      //----------------------------------------------------------------------//
      verSiLaTareaLlegoASuHoraDeDestino();
      //----------------------------------------------------------------------//
      const tiempoDeLasTarea = calcularCuantoTiempoRestanteLeQueda(tarea.tiempo);
      setTiempoRestante(tiempoDeLasTarea);
      //----------------------------------------------------------------------//
      // fondo
      const tiempoEnTiempoReal = fondoDePantalla();
      setTiempoFondoDePantalla(tiempoEnTiempoReal);

      // FD : CUANDO DIA CAMBIE Y NO SE EL MISMO DIA SE VA A ELIMINAR EL ALAMACENAMIENTO
      eliminarTodosLosIdsAlmacenadosCuandonSeaOtroDia();
    }, 60000);

    return () => clearInterval(interval);
  }, [tarea.tiempo]);

  //------------------------------------------------------------------------//

  useEffect(() => {
    eliminar_id_tarea_adelantada(tareaId)
   }, [tareaId])

  return (
    <div className="tarea" key={tarea.tareaID}>
      {tarea.tareaID === tareaId && mostrarModelActualizar ? (
        <ComponenteActualizarTarea
          id={tareaId}
          setMostrarModelActualizar={setMostrarModelActualizar}
        />
      ) : (
        <>
          <div className="tarea-contendor">
            <div className="tarea-contendor-info">
              <span className="tarea-tarea">{tarea.tarea}</span>
              <div className="contendor-datos-tareas">
                <span>
                  dias:
                  {VincularLosPuntos()
                    ? VincularLosPuntos().tareaHecha +
                      VincularLosPuntos().tareaNoHecha
                    : 0}{" "}
                </span>
                <span>
                  TH:{VincularLosPuntos() ? VincularLosPuntos().tareaHecha : 0}{" "}
                </span>
                <span>
                  TNH:{" "}
                  {VincularLosPuntos() ? VincularLosPuntos().tareaNoHecha : 0}{" "}
                </span>
              </div>
            </div>
            <div className="tarea-contenedor-btns">
              <button
                onClick={() => {
                  eliminarTarea(tarea.tareaID)
                  setTareaId(tarea.tareaID);
                }}
                className="tarea-btn"
              >
                <img className="icon-tarea" src={iconEliminar} alt="" />
              </button>
              <button
                onClick={() => {
                  setMostrarModelActualizar(true);
                  setTareaId(tarea.tareaID);
                }}
                className="tarea-btn"
              >
                <img className="icon-tarea" src={iconEditar} alt="" />
              </button>
              <button className="tarea-btn" onClick={() => {
                comenzarTarea(tarea.tareaID,tareaUser,setArrayConTodasLasTareasQueYaPasaronSuTiempo)
              } }>
                a
              </button>
            </div>
          </div>
          <div className="conts">
            <div className="contenedor-tiempo-tarea">
              <div style={{ width: "100%" }} className="tarea-tiempo">
                {tiempoRestante}
              </div>
              <div style={{ width: "100%" }} className="tarea-tiempo">
                {tarea.tiempo}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
