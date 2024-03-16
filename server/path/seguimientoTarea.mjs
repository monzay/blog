import { db } from "../index.mjs";

export const seguimientoTarea = (req, res) => {
  const { tareaID, tareaEcha, tareaNoEcha } = req.body;
  // hacemos todas la validaciones para que solo puedean dentras estos typos de datos y si hay datos 
  
    // insertamos los datos del usuario si completo su tarea en dicho tiempo 
    db.run("INSERT INTO seguimiento_tareas (tareaID,tarea_hecha,tarea_no_hecha) VALUES (?, ?,?)",[tareaID,tareaEcha,tareaNoEcha],(err) => {
      if (err) {
        console.log("[-] error: " + err);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
      } else {
        return res.status(200).json({ mensaje: "Se agregó el seguimiento de la tarea con éxito",});
      }
    }
  );
};