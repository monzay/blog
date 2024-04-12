import express from "express";
import cors from "cors"
import {login} from "./path/login.mjs"
import {sing_up} from "./path/sing_up.mjs"
import morgan from "morgan";
import sqlite from "sqlite3";
import {cargarInformacion}  from "./path/cargarInfomacion.mjs"
import { tareas } from "./path/crudTarea/añadir.mjs";
import { seguimientoTarea } from "./path/seguimientoTarea.mjs";
import { eliminar } from "./path/crudTarea/eliminar.mjs";
import { actualizar } from "./path/crudTarea/actualizar.mjs";
import 'dotenv/config'




import url from "url"
import path from "path";
import { CORS_FRONTEND, PORT } from "./configuracion";

function rutaDBsqlite (){
  const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const rutaDateBase = path.join(__dirname,"database","tareas.db")
return rutaDateBase
}

function eliminarCadaSemanaLosPuntosTareas(db) {
  const date = new Date();
  const dia = date.getDay(); 
  const horas = date.getHours(); 
  const minutos = date.getMinutes()

  let tiempoHastaProximoLunes = 0;
  if (dia === 0) tiempoHastaProximoLunes = 7 * 24 * 60 * 60 * 1000; 
  else tiempoHastaProximoLunes = (8 - dia) * 24 * 60 * 60 * 1000 - horas * 60 * 60 * 1000 - minutos * 60 * 1000;
  
  setTimeout(() => {
    db.run("DELETE FROM seguimiento_tareas", (err) => {
      if(err)console.log(err)
      else console.log("se elimino ")
    });
    
    setInterval(() => {
      db.run("DELETE FROM seguimiento_tareas", (err) => console.log(err));
    }, 7 * 24 * 60 * 60 * 1000); 
  }, tiempoHastaProximoLunes); 
}
const sqlite3 = sqlite.verbose() 
export const db =  new sqlite3.Database(rutaDBsqlite())

eliminarCadaSemanaLosPuntosTareas(db) 

const app = express()

app.use(cors({origin:CORS_FRONTEND}))
app.use(express.json())
app.use(morgan("dev"))

//inicio de sesion y registro 
app.post("/singUp",sing_up)
app.post("/login",login)

// carga los datos al iniciar a la app 
app.post("/app",cargarInformacion)
//crud de la app 

app.post("/app/enviar",tareas)
app.post("/app/eliminar",eliminar)
app.put("/app/actualizar",actualizar)

//seguimiento para todas las tareas del usuario si fue hecha o no 

app.post("/app/seguimiento",seguimientoTarea)



app.listen(PORT, () => {
  console.log("se devanto el servidor")
  });