  //------------------------------------------------------------------------//
  // FUNCION  QUE GUARDA EL TIEMPO QUE TRANSCURRIO Y LO GUARDA  AL SALIR DE LA PAGINA O REFRESCAR
  export  function guardarTiempoCuadoElUsuarioCierreLaPagina(tiempo) {
    window.addEventListener("beforeunload", function (e) {
      const ultimaHora = tiempo;
      localStorage.setItem("tiempoRestanTarea", JSON.stringify(ultimaHora));
    });
  }