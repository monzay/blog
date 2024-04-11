import { db } from "../index.mjs";

export const seguimientoTarea = (req, res) => {
  const { tareaID, tareaHecha, tareaNoHecha } = req.body;
  
    db.run("INSERT INTO seguimiento_tareas(tareaID,tarea_hecha,tarea_no_hecha) VALUES(?,?,?)", [tareaID,tareaHecha,tareaNoHecha],(err) => {
      if (err) {
        console.log("[-] error: " + err);
        return res.status(500).json({ mensaje: "Error interno del servidor"});
      } else {
        return res.status(200).json({ mensaje: "Se agregó el seguimiento de la tarea con éxito"});
      }
    }
  );
};