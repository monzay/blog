

// setArrayConTodasLasTareasQueYaPasaronSuTiempo()

// PARAMETROS 
// id: es el id 
// tarea: son todas las tareas que entan almacenadas 

   export  function comenzarTarea (id,tareas,setArrayConTodasLasTareasQueYaPasaronSuTiempo){
        const tareaSelecionada  = tareas.find((tarea) => tarea.tareaID === id  ) // busca
        if(localStorage.getItem("tiemposTareas")){ 
          const data = JSON.parse(localStorage.getItem("tiemposTareas"))
          if(!data.includes(id)){
            localStorage.setItem("tiemposTareas",JSON.stringify([...data,tareaSelecionada.tareaID]))
            setArrayConTodasLasTareasQueYaPasaronSuTiempo(prev => [...prev,tareaSelecionada.tareaID])
          }
        }
      }