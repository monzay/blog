import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { contextoTareas } from "../Contextos/ProviderTareas";
import { contextoPasarIdTareaCompletada } from "../Contextos/ProviderPasarIdTareaCompletada";
import {MostrarTiempoRestante} from "./seccion mostrar tarea que llegaron a su tiempo/MostrarTiempoRestante"
import {FormElegirTiempo} from "./seccion mostrar tarea que llegaron a su tiempo/FormElegirTiempo"
export const ModelHoraDeLaTarea = ({
  data,
  setEnvioElPunto,
  envioElPunto,
  todosLosIdsParaNoMostrar,
  setTodosLosIdsParaNoMostrar,
}) => {
  //[data] : retorna el id de la tarea que llego su tiempo para mostrarse
  //[setEnvioElPunto] : lo utilizamos para sabe si ya se completo la tarea click
  //[envioElPunto] :
  //[todosLosIdsParaNoMostrar] :
  //[todosLosIsetTodosLosIdsParaNoMostrardsParaNoMostrar] :

  // todos los useContext

  const { tareaUser } = useContext(contextoTareas);
  const { setIdTareaHecha } = useContext(contextoPasarIdTareaCompletada);
  // todos los state
  const [dataTarea, setDataTarea] = useState({});

  function mandarIdParaNoMastrarLasTareasCompletadas() {
    // obtenemos los datos locales
    const dataLocal = JSON.parse(localStorage.getItem("IdTareasHechas"));
    // estado que resive todos los ids
    const id = data;
    setTodosLosIdsParaNoMostrar((prev) => [...prev, id]);
    // el nuevo objeto que que se va sobrescribir todos los datos
    const newData = {
      ...dataLocal[0],
      ids: todosLosIdsParaNoMostrar,
    };
    console.log(newData);
    // actualizamos
    localStorage.setItem("IdTareasHechas", JSON.stringify([newData]));
  }

  // FUNCION:  para madandar el punto a la base de datos
  async function mandarDarPuntoDeLaTareaCompletada() {
    try {
      const datoDeLaTarea = {
        tareaID: dataTarea.tareaID,
        tareaEcha: 1,
        tareaNoEcha: 0,
      };

      const response = await fetch("http://localhost:3000/app/seguimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datoDeLaTarea),
      });
      const data = await response.json();

      if (response.ok) {
        setEnvioElPunto(!envioElPunto);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  }
  //EFFECT : sirve para contectar  las tareas
  useEffect(() => {
    const tarea = tareaUser.find((tarea) => tarea.tareaID === data);
    setDataTarea(tarea);
  }, [data]);

  const [minuto, setMinutos] = useState("");
  const [hora, setHora] = useState("");
  const [mostrarElegirTiempo, setMostrarElegirTiempo] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState([{ horas: 0, minutos: 0,id:0 }]);


  const [id,setId] = useState(0)

  //------------------------------------------------------------------------//
  function timepoEnterminarseElTiempo() {
    
    let stringHora = hora;
    let stringMinutos = minuto;
    //
    setTiempoRestante([{ horas: hora, minutos: minuto,id:data }]);

    if (stringHora) {
      const horaEnSegundos = parseInt(stringHora) * 3600; // Convertir horas a segundos (1 hora = 3600 segundos)
      const minutosEnSegundos = parseInt(stringMinutos) * 60; // Convertir minutos a segundos (1 minuto = 60 segundos)

      const tiempoTotalEnSegundos = horaEnSegundos + minutosEnSegundos;

      setInterval(() => {
        mandarDarPuntoDeLaTareaCompletada();
        mandarIdParaNoMastrarLasTareasCompletadas();
      }, tiempoTotalEnSegundos * 1000);
    }
  }
 //------------------------------------------------------------------------//
  function calcularTiempoQueElUsuarioDeclaro() {
    // funcion cuando el usuario elije el tiempo y hace click
    let horas = hora;
    let minutos = minuto;

    const interval = setInterval(() => {
      if (minutos !== 0) {
        minutos -= 1;
        setTiempoRestante([{ horas: horas, minutos: minutos ,id:data }]);
      } else {
        if (horas !== 0) {
          horas -= 1;
          minutos = 59; // Reiniciamos los minutos a 59
          setTiempoRestante([{ horas: horas, minutos: minutos,id:data }]);
        } else {
          clearInterval(interval); // Detenemos el intervalo cuando las horas y los minutos llegan a cero
        }
      }
    }, 60000);
  }
  //------------------------------------------------------------------------//
  useEffect(() => {
    function RetomamosElTiempo() {
      const tiempo = JSON.parse(localStorage.getItem("tiempoRestanTarea"));
      // vemos si timepo exite  
      if (tiempo) {
        // si exite metemos los datos alamacenados al estado y retomamos
        setTiempoRestante(tiempo);
        const { horas, minutos ,id} = tiempo[0];
        
        setId(id)
        const horaNumber = parseInt(horas)
        const minutosNumber = parseInt(minutos)

        // vemos si no modificaron los datos de forma externa 
        if (horaNumber && minutosNumber) {
          // tiempo almacenado
          let horaRetantes = horas;
          let minutosRentes = minutos;
          
          const interval = setInterval(() => {
            if (minutosRentes !== 0) {
              minutosRentes -= 1;
              setTiempoRestante([
                { horas: horaRetantes, minutos: minutosRentes },
              ]);
            } else {
              if (horaRetantes !== 0) {
                horaRetantes -= 1;
                minutosRentes = 59;
                setTiempoRestante([
                  { horas: horaRetantes, minutos: minutosRentes },
                ]);
              } else {
                clearInterval(interval);
              }
            }
          }, 60000);
        }
      }
    }
    RetomamosElTiempo();
  }, []);

  //------------------------------------------------------------------------//
  // funcion para cuando salga de la pagina o la refrezque
  function guardarTiempoCuadoElUsuarioCierreLaPagina() {
    window.addEventListener("beforeunload", function (event) {
      if (tiempoRestante[0].horas || tiempoRestante[0].minutos) {
        const ultimaHora = tiempoRestante;
        localStorage.setItem("tiempoRestanTarea", JSON.stringify(ultimaHora));
      }
    });
  }
  guardarTiempoCuadoElUsuarioCierreLaPagina();
  //------------------------------------------------------------------------//
  // ejecuta todo con un click
  function clickEjecucion() {
   const tiempo =  JSON.parse(localStorage.getItem("tiempoRestanTarea"))
   if(!tiempo[0]){
    if (hora) {
      timepoEnterminarseElTiempo();
      calcularTiempoQueElUsuarioDeclaro();
    }
   }else{
    console.log("exite un tiempo ya ")
   }

    setMostrarElegirTiempo(false);
    setId(data)
  }
   //------------------------------------------------------------------------//

  return (
    <li className="contenedor-mostrar-hora-de-hacerla">
       <span>{dataTarea.tarea} </span>

      {id === data && <MostrarTiempoRestante tiempoRestante={tiempoRestante} />}
      {mostrarElegirTiempo &&  <FormElegirTiempo setHora={setHora} setMinutos={setMinutos} clickEjecucion={clickEjecucion} /> }
      {!mostrarElegirTiempo && (
        <div className="contendor-btn-componente-mostrar-hora-de-la-tarea">
          <button className="btn-componente-mostrar-hora-de-la-tarea" onClick={() => {  setMostrarElegirTiempo(true);  setIdTareaHecha(data); }} >
          comenzar 
        </button>
        </div>
      )}
    </li>
  );
};




























