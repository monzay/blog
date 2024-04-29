export  function eliminar_id_tarea_adelantada (id){
    const tiempoTarea = JSON.parse(localStorage.getItem("tiemposTareas"))
       if(tiempoTarea.length !== 0){
        if(tiempoTarea[0].tareaID === id){
          localStorage.setItem("tiemposTareas",JSON.stringify([]))
      }
       }
  }

