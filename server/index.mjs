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
const sqlite3 = sqlite.verbose() 

export const db =  new sqlite3.Database("C:/Users/FRANCISCO/Desktop/blog/blog-de-notas/server/database/tareas.db")

const app = express()
app.use(cors())
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

app.listen(3000, () => {
    console.log(`pueto 3000`);
  });