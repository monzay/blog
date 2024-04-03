import { db } from "../../index.mjs";

const obtenerFecha = () => {
  const date = new Date();
  const año = date.getFullYear()
  const mes = date.getMonth() + 1
  const diaDelMes =  date.getDate()
  return `${año}-${mes}-${diaDelMes}`
};


export const tareas = (req, res) => {

  const { idUser, tarea, tiempo } = req.body;
  
  if (tarea) {
    db.run("INSERT INTO detalles_tarea (id_user,tarea,tiempo,fecha) VALUES (?,?,?,?)",
      [idUser, tarea, tiempo,obtenerFecha()],
      (err) => {
        if (err) {
          console.log("[-] error: " + err);
          return res.status(500).json({ mensaje: "Error interno del servidor" });
        } else {
          return res.status(200).json({ mensaje: "se agrego la tarea con exito" });
        }
      }
    );
  }
};
