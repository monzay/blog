export function comenzarTarea(id,tareas,setArrayConTodasLasTareasQueYaPasaronSuTiempo) {

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

  if (localStorage.getItem("tiemposTareas")) {
    if (data.length === 0) {
      // SI NO ARRAY ESTA VACIO AGREGAMOS LA TAREA SIN ASCO 
      localStorage.setItem("tiemposTareas", JSON.stringify([...data,tarea]));
      setArrayConTodasLasTareasQueYaPasaronSuTiempo((prev) => [...prev, tareaSelecionada.tareaID]);
    } else {
      // EN CASO QUE TENG ELEMENTOS VEMOS QUE NOSE REPITAN 
      data.forEach((t) => {
        if (t.tareaID !== id) {
          localStorage.setItem("tiemposTareas",JSON.stringify([...data, tarea]));
          setArrayConTodasLasTareasQueYaPasaronSuTiempo((prev) => [...prev, tareaSelecionada.tareaID]);
        }
      });
    }
  }
}
