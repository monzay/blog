import { db } from "../../index.mjs";

export const eliminar = (req, res) => {
    const {idUser,tareaID} = req.body;

    // mejorar las validacioens como de que typo es si estan vacias etc 
    if(idUser && tareaID ){
        db.run(`DELETE FROM detalles_tarea 
        WHERE tareaID IN (
            SELECT dt.tareaID FROM sesiones as s
            INNER JOIN detalles_tarea as dt 
            ON s.id_user = dt.id_user 
            WHERE s.id_user = ? AND dt.tareaID = ? 
        );`,
        [idUser,tareaID],(err)=>{
            if(err){
                console.error("[-] Error en la consulta SQL:", err);
                return res.status(500).json({ mensaje: "no se pudo eliminar la tarea" });
            }else{
                return res.status(200).json({ mensaje: "se elimino ta tarea con exito" });
            }
        }
        )
    }

};