import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { contextoTareas } from "../Contextos/ProviderTareas";
import { contextoPasarIdTareaCompletada } from "../Contextos/ProviderPasarIdTareaCompletada";
import { MostrarTiempoRestante } from "./seccion mostrar tarea que llegaron a su tiempo/MostrarTiempoRestante";
import { FormElegirTiempo } from "./seccion mostrar tarea que llegaron a su tiempo/FormElegirTiempo";
import { contextoEjecutarRetomarTiempo } from "../Contextos/ProviderEjecutarRetomarTiempo";
export const ModelHoraDeLaTarea = ({ data}) => {
  //[data] : retorna el id de la tarea que llego su tiempo para mostrarse

  const { tareaUser } = useContext(contextoTareas);
  const { setIdTareaHecha } = useContext(contextoPasarIdTareaCompletada);
  const {setEnvioElPunto,envioElPunto,tiempoRestante,setTiempoRestante,setId,id,setIndentificador,setTodosLosIdsParaNoMostrar} =   useContext(contextoEjecutarRetomarTiempo)
  
  const [dataTarea, setDataTarea] = useState({});
  const [mostrarElegirTiempo, setMostrarElegirTiempo] = useState(false);
  const [tiempo, setTiempo] = useState("");
  const [error, setError] = useState("");

  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//

  // EFFECT QUE VE SI LOS EL REPO SE CREO  Y SINO LO CREA
  useEffect(() => {
    const tiempoLocal = localStorage.getItem("tiempoRestanTarea");
    if (!tiempoLocal) {
      localStorage.setItem(
        "tiempoRestanTarea",
        JSON.stringify({ horas: 0, minutos: 0, id: 0, horaEnLaQueComenzo: "" })
      );
    }
  }, []);
  //------------------------------------------------------------------------//
  // FUNCION  QUE GUARDA EL TIEMPO QUE TRANSCURRIO Y LO GUARDA  AL SALIR DE LA PAGINA O REFRESCAR
  function guardarTiempoCuadoElUsuarioCierreLaPagina() {
    window.addEventListener("beforeunload", function (e) {
      const ultimaHora = tiempoRestante;
      localStorage.setItem("tiempoRestanTarea", JSON.stringify(ultimaHora));
    });
  }
  guardarTiempoCuadoElUsuarioCierreLaPagina();
  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//

  // SIRVE LA ENTRELAZAR LOS DATOS

  useEffect(() => {
    const tarea = tareaUser.find((tarea) => tarea.tareaID === data);
    setDataTarea(tarea);
  }, []);

  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//

  //SUB FUNCION
  // FUNCION PARA MANDAR LOS DATOS A LA BASE DE DATOS
  
  async function mandarDarPuntoDeLaTareaCompletada() {
    try {
      const datoDeLaTarea = {
        tareaID:dataTarea.tareaID,
        tareaHecha: 1,
        tareaNoHecha: 0,
      };

      const response = await fetch("http://localhost:3000/app/seguimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datoDeLaTarea),
      });
      const data = await response.json();
      if (response.ok) console.log(data);
      setEnvioElPunto(!envioElPunto);
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  }
  // SUB FUNCION
  function mandarIdParaNoMastrarLasTareasCompletadas() {
    const dataLocal = JSON.parse(localStorage.getItem("IdTareasHechas"));
    const id = data ;
    setTodosLosIdsParaNoMostrar((prev) => [...prev, id]);
    const newData = {
      ...dataLocal[0],
      ids: [...dataLocal[0].ids, id],
    };
    localStorage.setItem("IdTareasHechas", JSON.stringify([newData]));
  }
  // SUB FUNCION
  function timepoActual() {
    const date = new Date();
    const horas = date.getHours();
    const minutos = date.getMinutes();
    const stringHoras = horas;
    const stringMinutos = minutos < 10 ? `0${minutos}` : minutos;
    const stringTiempo = `${stringHoras}:${stringMinutos}`;
    return stringTiempo;
  }
  // SUB FUNCION
  function restarTiempo(horasRestantes, minutosRentes) {

    const interval = setInterval(() => {
      if (minutosRentes !== 0) {
        minutosRentes -= 1;
        setTiempoRestante((prev) => ({
          ...prev,
          horas: horasRestantes,
          minutos: minutosRentes,
        }));
      } else {
        if (horasRestantes !== 0) {
          horasRestantes -= 1;
          minutosRentes = 59;
          setTiempoRestante((prev) => ({
            ...prev,
            horas: horasRestantes,
            minutos: minutosRentes,
          }));
        } else {
          clearInterval(interval);
          mandarDarPuntoDeLaTareaCompletada();
          mandarIdParaNoMastrarLasTareasCompletadas();
        }
      }
    }, 1000);
  }
  // FRUNCION DECLARACION DEL TIEMPO
  function calcularTiempoQueElUsuarioDeclaro() {
    setIndentificador({ tiempoDeclado: true, retomarTiempo: false });
    let horasRestantes = tiempo.indexOf(":") === -1 ? 0 : tiempo.split(":")[0];
    let minutosRentes = tiempo.indexOf(":") === -1 ? tiempo : tiempo.split(":")[1];
    setTiempoRestante({
      horas: horasRestantes,
      minutos: minutosRentes,
      id: data,
      horaEnLaQueComenzo: timepoActual(),
    });

    restarTiempo(horasRestantes, minutosRentes);
  }

  // CLICK CUANDO SE DECLARA EL TIEMPO
  function clickEjecucion(e) {
    e.preventDefault();

    const { horas, minutos } = JSON.parse(
      localStorage.getItem("tiempoRestanTarea")
    );
    // VALIDACION PARA QUE SE PA QUE ESTA PASANDO EL USUARIO

    if (horas !== 0 && minutos !== 0) {
      setError("hay un tiempo que esta corriendo espara capo");
      return;
    } else if (!tiempo) {
      setError("dale pelotudo pone el tiempo");
      return;
    } else {
      calcularTiempoQueElUsuarioDeclaro();
    }
    setMostrarElegirTiempo(false);
    setId(data);
  }
  
  //------------------------------------------------------------------------//
  // FUNCIONES PARA ARREGLAR EN UN FUTURO 
  useEffect(() => {
    function calcularElTiempoRestanteCuandoElUsuarioNoEstaEnLaPagina() {
      const dataLocal = JSON.parse(localStorage.getItem("tiempoRestanTarea"));
      console.log(dataLocal);

      if (dataLocal.horas !== 0 || dataLocal.minutos !== 0) {
        const tiempoElegido = dataLocal.horas + ":" + dataLocal.minutos;
        const ss = dataLocal.horaEnLaQueComenzo;

        const tiempoQueArranco = ss.split(":");
        // Obtener la hora actual y los minutos
        const date = new Date();
        const horas = date.getHours();
        const minutos = date.getMinutes();
        // Calcular la diferencia de tiempo entre el momento actual y el momento de inicio
        let h = horas - parseInt(tiempoQueArranco[0]);
        let m = minutos - parseInt(tiempoQueArranco[1]);
        // Ajustar los minutos si es necesario
        if (m < 0) {
          h -= 1;
          m += 60;
        }

        // Separar la hora elegida en partes
        const [nun1, nun2] = tiempoElegido.split(":");
        // Calcular la diferencia entre la hora elegida y la hora actual
        let xh = parseInt(nun1) - h;
        let xm = parseInt(nun2) - m;
        // Ajustar los minutos si es necesario
        if (xm < 0) {
          xh -= 1;
          xm += 60;
        }
        console.log(`${xh}:${xm}`);
        // new datos si el usario no estaba en la pagina
        const newObjet = {
          ...dataLocal,
          horas: xh,
          minutos: xm,
        };
        setTiempoRestante(newObjet);
      }
    }
  }, []);

  return (
    <li className="contenedor-mostrar-hora-de-hacerla">
      <span>{dataTarea.tarea } </span>
      {id === data && <MostrarTiempoRestante />}
      {mostrarElegirTiempo && (
        <FormElegirTiempo
          error={error}
          setTiempo={setTiempo}
          clickEjecucion={clickEjecucion}
          tiempo={tiempo}
        />
      )}
      {!mostrarElegirTiempo && (
        <div className="contendor-btn-componente-mostrar-hora-de-la-tarea">
          <button
            className="btn-componente-mostrar-hora-de-la-tarea"
            onClick={() => {
              setMostrarElegirTiempo(true);
              setIdTareaHecha(data);
            }}
          >
            comenzar
          </button>
        </div>
      )}
    </li>
  );
};
