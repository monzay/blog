export  function eliminar_id_tarea_adelantada (id){
    const tiempoTarea = JSON.parse(localStorage.getItem("tiemposTareas"))
       if(tiempoTarea){
        if(tiempoTarea.id === id){
          localStorage.setItem("tiemposTareas",JSON.stringify({}))
       }
       }
  }

