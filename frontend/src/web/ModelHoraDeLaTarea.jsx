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
export const ModelHoraDeLaTarea = ({ data }) => {
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

  //------------------------------------------------------------------------//


  useEffect(() => {
    // VEMOS  SI HAY CONTROLADORES LOCALES  DE (ADELANTAR TAREA)
    const controladoresLocales = JSON.parse(
      localStorage.getItem("tiemposTareas")
    );
    if (controladoresLocales) {
    }
  }, []);



  // EFFECT QUE VE SI LOS EL REPO SE CREO  Y SINO LO CREA
  useEffect(() => {
    const tiempoLocal = localStorage.getItem("tiempoRestanTarea")
    if (!tiempoLocal) {
      localStorage.setItem(  "tiempoRestanTarea", JSON.stringify(
        {
         horas: 0,
          minutos: 0,
           id: 0,
            horaEnLaQueComenzo: "" 
          }) );
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
  guardarTiempoCuadoElUsuarioCierreLaPagina()
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
    }, 60000);

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
    let minutosRentes = tiempo.indexOf(":") === -1 ? tiempo : tiempo.split(":")[1];

    setTiempoRestante({
      horas: horasRestantes,
      minutos: minutosRentes,
      id: data,
      horaEnLaQueComenzo: timepoActual(),
    });

    // restarTiempo(horasRestantes, minutosRentes);
  }
  // CLICK CUANDO SE DECLARA EL TIEMPO


  function click_ejecucion(e) {

    e.preventDefault();
    const { horas, minutos } = JSON.parse( localStorage.getItem("tiempoRestanTarea"));
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
    controladores_para_mostrar_los_btns(false,true,false,false,true)
  }

  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//

  const [intervalRetarTiempo, setIntervalRestarTiempo] = useState(null);

  
  const [controladores, setControladores] = useState({
    id:0,
    from: false,
    btns: false,
    iniciar: true,
    btnPlay: false,
    btnStop: false,
  });

  const [activo,setActivo] = useState(false)
  




  useEffect(() => {
    // OBETEMOS LOS CONTROLADORES LOCAL SI EXITEN PARA MOSTRAR LOS BTNS CORRESPONDIENTES 
    const controladores_locales = JSON.parse(localStorage.getItem("controladores"))
    // SI EXITE SE EJECUTA  Y SI NO FUE (YA QUE SI EL USUARIO ELIMINA DATOS DE LOCALSTORAGE)
    if(controladores_locales){
      // CONDICION PARA SOLO QUE OBTENGA CON CONTROLADORES DE UNA TAREA ESPECIFICA
      if(controladores_locales.id === data){
        setControladores(controladores_locales)
      }
    }
    // EVENTO QUE DETECTA LOS CAMBION DEL LOCALSTORAGE (PARA QUE OBTENGAMOS LOS CONTROLADORES EN TIEMPO REAL)
    const handleStorageChange = (event) => {
      if (event.key === "controladores") {
        const controladores_locales  = JSON.parse(event.newValue);
        setControladores(controladores_locales);
      }
    };
    window.addEventListener("storage", handleStorageChange);
  // DESMONTAMOS 
    return () => window.removeEventListener("storage", handleStorageChange);
    
  }, []); 

  


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

 


  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//
  //------------------------------------------------------------------------//

  function controladores_para_mostrar_los_btns  (from,btns,iniciar,btnPlay,btnStop){

    const controladoresInicio  =  {
      id:data,
      from: from,
      btns: btns,
      iniciar: iniciar,
      btnPlay: btnPlay,
      btnStop: btnStop,
     }

     localStorage.setItem("controladores",JSON.stringify(controladoresInicio))
     setControladores(controladoresInicio)
    
  }

  // EVENTOS CLICK
  function click_btn_Iniciar() {
    setMostrarElegirTiempo(true);
    setIdTareaHecha(data);
    controladores_para_mostrar_los_btns(true,false,false,false,false)
  }

  function click_btn_play (){
    controladores_para_mostrar_los_btns(false,true,false,false,true)
  }
  function click_btn_stop (){
    controladores_para_mostrar_los_btns(false,true,false,true,false)
  }
  




  return (
    <li className="contenedor-mostrar-hora-de-hacerla">
      <span>{dataTarea.tarea} </span>
      {id === data && <MostrarTiempoRestante />}
      {controladores.from && (
        <FormElegirTiempo
          error={error}
          setTiempo={setTiempo}
          click_ejecucion={click_ejecucion}
          tiempo={tiempo}
        />
      )}
      {controladores.iniciar   && (
        <div className="contendor-btn-componente-mostrar-hora-de-la-tarea">
          <BtnIniciar funcion={click_btn_Iniciar} />
        </div>
      )}
      {controladores.btns && (
        <>
          <BtnControladores txt="play" clickFuncion={click_btn_play} state={setActivo} param={true} />
          <BtnControladores txt="stop"  clickFuncion={click_btn_stop} state={setActivo} param={false} />
        </>
      )}
    </li>
  );
};
