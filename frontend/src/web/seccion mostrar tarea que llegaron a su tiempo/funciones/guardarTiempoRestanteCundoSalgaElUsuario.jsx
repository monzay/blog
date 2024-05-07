export  function guardarTiempoCuadoElUsuarioCierreLaPagina(tiempo) {
  window.addEventListener("beforeunload", function (e) {
    localStorage.setItem("tiempoRestanTarea", JSON.stringify(tiempo));
  });
}