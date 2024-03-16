import { db } from "../../index.mjs";

export const actualizar = (req, res) => {
    const {
        tarea,
        tiempo,
        idUser,
        tareaID} = req.body;
        
    if(idUser && typeof idUser === "number" && tareaID && typeof tareaID === "number" ){
        
        // consulta sqlite3 para actualizar los datos 
        db.run(`UPDATE detalles_tarea AS dt
        SET tarea = ?,tiempo = ? 
        FROM sesiones AS s
        WHERE dt.id_user = s.id_user AND dt.id_user = ? AND dt.tareaID = ?`,
        [tarea,tiempo,idUser,tareaID],(err)=>{
            if(err){
                console.error("[-] Error en la consulta SQL:", err);
                return res.status(500).json({ mensaje: "no se pudo eliminar la tarea" });
            }else{
                return res.status(200).json({ mensaje: "se actualizo con exito" });
            }
        }
        )
    }


};