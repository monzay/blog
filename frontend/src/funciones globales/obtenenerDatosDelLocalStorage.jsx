export function obtenerCredencialesUse() {
    const credencialesLocalStore = JSON.parse(
      localStorage.getItem("credenciales")
    );
    return credencialesLocalStore;
  }

export   function obetnerTareaLocales() {
  const tareasLocales = JSON.parse(localStorage.getItem("tareas"));
  return tareasLocales;
}