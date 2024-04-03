import { db } from "../index.mjs";

export const cargarInformacion = async (req, res) => {

  try {
    const { idUser } = req.body;

    const tareasID = await new Promise((resolve, reject) => {
      db.all( `SELECT s.id_user,s.nombre,tarea,tareaID,descripcion,tiempo FROM detalles_tarea as dt 
      INNER JOIN sesiones as s ON dt.id_user = s.id_user
      WHERE dt.id_user = ?
      `,
        [idUser],(err, rows) => {
          if (err) {
            console.log("[-] error: " + err);
            reject(err);
          } else {
            console.log(rows)
            resolve(rows);
          }
        }
      );
    }); 

    const puntosTareas  = await new Promise((resolve, reject) => {
      db.all(
        `
        SELECT dt.tareaID, sum(tarea_hecha) as tareaHecha, sum(tarea_no_hecha) tareaNoHecha 
        FROM sesiones AS s
        INNER JOIN detalles_tarea AS dt ON dt.id_user = s.id_user
        INNER JOIN seguimiento_tareas AS st ON st.tareaID = dt.tareaID
        WHERE dt.id_user = ?
        GROUP BY tarea `,
        [idUser],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
    
    
    const tareasTops = await new Promise((resolve, reject) => {
      db.all(
        `SELECT nombre,dt.tarea,sum(st.tarea_hecha) as puntos_user FROM sesiones as s
        INNER JOIN detalles_tarea as dt ON s.id_user = dt.id_user
        INNER JOIN seguimiento_tareas as st On dt.tareaID = st.tareaID
        
        GROUP BY dt.id_user
        ORDER BY puntos_user DESC `,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });

    res.status(200).json({tareasTops,tareasID,puntosTareas});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};
