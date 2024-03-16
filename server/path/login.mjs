import { db } from "../index.mjs"

export const login = (req, res) => {
  const { email, password } = req.body;

  // mejorar la validacion 
  if(email && password){
    db.get("SELECT id_user,nombre  FROM sesiones WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (err) {
            console.log("[-] error: " + err);
            return res.status(500).json({ mensaje: "Error interno del servidor" });
        }
        if (row) {
            const credenciales = {
                idUser: row.id_user,
                nombre: row.nombre,
                token: true
            };
            return res.status(200).json({credenciales});
        }else 
        return  res.status(200).json({mensaje:"no se encontro la cuenta"})
    });
  }
};