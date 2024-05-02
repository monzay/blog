
export function comenzarTarea(id,tareas,setArrayConTodasLasTareasQueYaPasaronSuTiempo,arrayConTodasLasTareasQueYaPasaronSuTiempo) {

  const tareaSelecionada = tareas.find((tarea) => tarea.tareaID === id); // BUSCAR LA TAREA 

  const data = JSON.parse(localStorage.getItem("tiemposTareas")); 


  const tarea = {
    id: tareaSelecionada.tareaID,
    from:false,
    btns:true,
    iniciar:false,
    btnPlay: false,
    btnStop:false 
  };

    const ids_no_mostrar = JSON.parse(localStorage.getItem("IdTareasHechas"))[0].ids
    const ids_mostrar =  JSON.parse(localStorage.getItem("tareaMostrar"))
    
  if (data){
    //( EL ID NO PUEDE SER EL MISMO) Y (NO DEBE ESTAR DENTRO DEL LOS ID QUE YA NOSE TIENENQ QUE MOSTRAR)
    if(data.id !== id && !ids_no_mostrar.includes(id) && !ids_mostrar.includes(id)){
        localStorage.setItem("tiemposTareas",JSON.stringify(tarea));
        setArrayConTodasLasTareasQueYaPasaronSuTiempo((prev) => [...prev, tareaSelecionada.tareaID]);
      }
  }
}
