import { db } from "../index.mjs";
export const sing_up = (req, res) => {
  const { nombre, password, email } = req.body;
  console.log(req.body);

  if (nombre == "") {

   res.status(400).json({
      mensaje: "El campo nombre es obligatorio y no puede estar vacío.",
    });
    return
  } else if (email == "") {
    res.status(400).json({
      mensaje: "El campo 'email' debe ser un correo electrónico válido.",
    });
    return 
  } else if (password == "") {
     res.status(400).json({ mensaje: "El campo 'password' debe tener al menos 6 caracteres." });
      return 
  }

  if (
    nombre &&
    typeof nombre === "string" &&
    email &&
    typeof email === "string" &&
    password &&
    typeof password === "string"
  ) {
    
    db.serialize(() => {
      // Verificar si el usuario ya existe
      db.get(
        "SELECT email,password FROM sesiones WHERE email = ? AND password =  ?",
        [email, password],
        (err, row) => {
          if (err) {
            console.log("[-] error: " + err);
            return res
              .status(500)
              .json({ mensaje: "Error interno del servidor" });
          }
          if (row) {
            // El usuario ya existe
            return res.status(200).json({ mensaje: "La cuenta ya existe" });
          }
        }
      );
      
      db.run(`INSERT INTO sesiones (nombre,email,password) 
      VALUES(?,?,?)`,[nombre, email, password],(err) => {
          if (err) {
            console.log("[-] error: " + err);
            return res
              .status(500)
              .json({mensaje: "Error interno del servidor" });
          } else {
            return res.status(200).json({ mensaje: "se registro con exito" });
          }
        }
      );
    });
  }
};
