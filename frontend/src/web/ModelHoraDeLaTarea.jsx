import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { contextoTareas } from "../Contextos/ProviderTareas";
import { contextoPasarIdTareaCompletada } from "../Contextos/ProviderPasarIdTareaCompletada";
import { MostrarTiempoRestante } from "./seccion mostrar tarea que llegaron a su tiempo/MostrarTiempoRestante";
import { FormElegirTiempo } from "./seccion mostrar tarea que llegaron a su tiempo/FormElegirTiempo";
import { contextoEjecutarRetomarTiempo } from "../Contextos/ProviderEjecutarRetomarTiempo";
import { RUTA_BACKEND } from "../../configuracion";
import { BtnControladores } from "./seccion mostrar tarea que llegaron a su tiempo/BtnControladores";
import { BtnIniciar } from "./seccion mostrar tarea que llegaron a su tiempo/BtnIniciar";
import { guardarTiempoCuadoElUsuarioCierreLaPagina } from "./seccion mostrar tarea que llegaron a su tiempo/funciones/guardarTiempoRestanteCundoSalgaElUsuario";
export const ModelHoraDeLaTarea = ({ data,setControladores,controladores }) => {
  //[data] : retorna el id de la tarea que llego su tiempo para mostrarse

  const { tareaUser } = useContext(contextoTareas);
  const { setIdTareaHecha } = useContext(contextoPasarIdTareaCompletada);
  const {
    setEnvioElPunto,
    envioElPunto,
    tiempoRestante,
    setTiempoRestante,
    setId,
    id,
    setIndentificador,
    setTodosLosIdsParaNoMostrar,
  } = useContext(contextoEjecutarRetomarTiempo);

  const [dataTarea, setDataTarea] = useState({});
  const [mostrarElegirTiempo, setMostrarElegirTiempo] = useState(false);
  const [tiempo, setTiempo] = useState("");
  const [error, setError] = useState("");



  // const [controladores, setControladores] = useState({
  //   id:data,
  //   from: false,
  //   btns: false,
  //   iniciar: true,
  //   btnPlay: false,
  //   btnStop: false,
  // });


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
  guardarTiempoCuadoElUsuarioCierreLaPagina(tiempoRestante);
  //------------------------------------------------------------------------//
  // SIRVE LA ENTRELAZAR LOS DATOS

  useEffect(() => {
    const tarea = tareaUser.find((tarea) => tarea.tareaID === data);
    setDataTarea(tarea);
  }, []);

  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//

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

    setIntervalRestarTiempo(interval);
  }

  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//

  //SUB FUNCION
  // FUNCION PARA MANDAR LOS DATOS A LA BASE DE DATOS
  async function mandarDarPuntoDeLaTareaCompletada() {
    try {
      const datoDeLaTarea = {
        tareaID: dataTarea.tareaID,
        tareaHecha: 1,
        tareaNoHecha: 0,
      };

      const response = await fetch(`${RUTA_BACKEND}/app/seguimiento`, {
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
    const id = data;
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

  // FRUNCION DECLARACION DEL TIEMPO
  function calcularTiempoQueElUsuarioDeclaro() {
    setIndentificador({ tiempoDeclado: true, retomarTiempo: false });

    let horasRestantes = tiempo.indexOf(":") === -1 ? 0 : tiempo.split(":")[0];
    let minutosRentes =
      tiempo.indexOf(":") === -1 ? tiempo : tiempo.split(":")[1];

    setTiempoRestante({
      horas: horasRestantes,
      minutos: minutosRentes,
      id: data,
      horaEnLaQueComenzo: timepoActual(),
    });

    // restarTiempo(horasRestantes, minutosRentes);
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
    setActivo(true);
    setMostrarElegirTiempo(false);
    setId(data);
    setControladores(
      {
        id:data,
        from: false,
        btns: true,
        iniciar: false,
        btnPlay: false,
        btnStop: true,
      }
    );
  }

  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//

  const [intervalRetarTiempo, setIntervalRestarTiempo] = useState(null);
  const [activo, setActivo] = useState(false);



  useEffect(() => {
    if (activo) {
      const { horas, minutos } = JSON.parse(
        localStorage.getItem("tiempoRestanTarea")
      );
      if (horas !== 0 || minutos !== 0) {
        restarTiempo(horas, minutos);
      } else {
        let horasRestantes =
          tiempo.indexOf(":") === -1 ? 0 : tiempo.split(":")[0];
        let minutosRentes =
          tiempo.indexOf(":") === -1 ? tiempo : tiempo.split(":")[1];
        restarTiempo(horasRestantes, minutosRentes);
      }
    } else {
      localStorage.setItem("tiempoRestanTarea", JSON.stringify(tiempoRestante));
      clearInterval(intervalRetarTiempo);
    }
  }, [activo]);

  //------------------------------------------------------------------------//

  // FUNCIONES PARA ARREGLAR EN UN FUTURO
  // useEffect(() => {
  //   function calcularElTiempoRestanteCuandoElUsuarioNoEstaEnLaPagina() {
  //     const dataLocal = JSON.parse(localStorage.getItem("tiempoRestanTarea"));
  //     console.log(dataLocal);

  //     if (dataLocal.horas !== 0 || dataLocal.minutos !== 0) {
  //       const tiempoElegido = dataLocal.horas + ":" + dataLocal.minutos;
  //       const ss = dataLocal.horaEnLaQueComenzo;

  //       const tiempoQueArranco = ss.split(":");
  //       // Obtener la hora actual y los minutos
  //       const date = new Date();
  //       const horas = date.getHours();
  //       const minutos = date.getMinutes();
  //       // Calcular la diferencia de tiempo entre el momento actual y el momento de inicio
  //       let h = horas - parseInt(tiempoQueArranco[0]);
  //       let m = minutos - parseInt(tiempoQueArranco[1]);
  //       // Ajustar los minutos si es necesario
  //       if (m < 0) {
  //         h -= 1;
  //         m += 60;
  //       }

  //       // Separar la hora elegida en partes
  //       const [nun1, nun2] = tiempoElegido.split(":");
  //       // Calcular la diferencia entre la hora elegida y la hora actual
  //       let xh = parseInt(nun1) - h;
  //       let xm = parseInt(nun2) - m;
  //       // Ajustar los minutos si es necesario
  //       if (xm < 0) {
  //         xh -= 1;
  //         xm += 60;
  //       }
  //       console.log(`${xh}:${xm}`);
  //       // new datos si el usario no estaba en la pagina
  //       const newObjet = {
  //         ...dataLocal,
  //         horas: xh,
  //         minutos: xm,
  //       };
  //       setTiempoRestante(newObjet);
  //     }
  //   }
  // }, []);

  // CONTROLADORES PARA MOSTRAR LOS BTNS PLAY Y STOP

 



  // EVENTOS CLICK
  function click_btn_Iniciar() {
    setMostrarElegirTiempo(true);
    setIdTareaHecha(data);
    
    const controladoresInicio  =  {
       id:data,
       from: true,
       btns: false,
       iniciar: false,
       btnPlay: false,
       btnStop: false,
      }
    setControladores(controladoresInicio);
    

    const  x = JSON.parse(localStorage.getItem("tiemposTareas"))
    localStorage.setItem("tiemposTareas",JSON.stringify([...x ,controladoresInicio]))
  }


  // FUNCIONES QUE YA HICE PERO LAS TENGO QUE VOLVER HACER YA QUE ME BORRARON O ESTAN EL PC 
  // CREAR UN USEEFFECT QUE DETECTE  LOS  CAMIBION DEL LOCAL STORAGE  Y QUE  LOS META AL ESTADO CONOTROLADORES 






  function click_play_stop(play,stop){
     const  controladores =  {
        id:data,
        from: false,
        btns: true,
        iniciar: false,
        btnPlay: play,
        btnStop: stop,
      }
    localStorage.setItem("controladores",JSON.stringify(controladores))
  }
  

 function click_play (){
  click_play_stop(true,false)
 }
 function click_stop (){
  click_play_stop(false,true)
 }
 
 
  

  return (
    <li className="contenedor-mostrar-hora-de-hacerla">
      <span>{dataTarea.tarea} </span>
      {id === data && <MostrarTiempoRestante />}
      {controladores.from && (
        <FormElegirTiempo
          error={error}
          setTiempo={setTiempo}
          clickEjecucion={clickEjecucion}
          tiempo={tiempo}
        />
      )}
      {controladores.iniciar && (
        <div className="contendor-btn-componente-mostrar-hora-de-la-tarea">
          <BtnIniciar funcion={click_btn_Iniciar} />
        </div>
      )}
      {controladores.btns && (
        <>
          <BtnControladores txt="play"funcion={click_play} state={setActivo} param={true} />
          <BtnControladores txt="stop" funcion={click_stop} state={setActivo} param={false} />
        </>
      )}
    </li>
  );
};
