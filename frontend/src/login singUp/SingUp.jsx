import { useState } from "react";
import React from "react";
import "../app styles/fromSingUp.css";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export const SingUp = () => {

  const  redirigirApp = useNavigate()

  useEffect(() => {
     const credenciales = JSON.parse( localStorage.getItem("credenciales"))
     if(credenciales){
      if(credenciales.token) return redirigirApp("/app")
     }
  }, [])





  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

 const navegate = useNavigate();
//--------------------------------------------------------------//
  // VALIDACIONES 


  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const fromSingUp = async (e) => {
    e.preventDefault();

    try {
      // Validación de campos vacíos
      if (!nombre || !email || !password) {
        setError("Por favor, completa todos los campos.");
        return;
      }
      // Validación de formato de email
      else if (!validarEmail(email)) {
        setError("Por favor, introduce un correo electrónico válido.");
        return;
      }
    else {

      
        const credencialesUser = {
          nombre,
          email,
          password,
        };

        
        const response = await fetch("http://localhost:3000/singUp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credencialesUser),
        });
        const data = await response.json();
          setError(data.mensaje)
          navegate("/login")
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="contenedor-from">
      <form class="form" onSubmit={fromSingUp}>
        <p class="login">Resgistrarse</p>
        <div class="inputContainer">
          <input
            onChange={(e) => setNombre(e.target.value)}
            placeholder="nombre"
            type="text"
            class="fInput email"
          />
        </div>

        <div class="inputContainer">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            type="text"
            class="fInput email"
          />
        </div>

        <div class="inputContainer">
          <button  class="submit" > enviar
          </button>
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="contraseña"
            type="text"
            class="fInput email"
          />
          <input
            placeholder="Enter your password"
            type="text"
            class="fInput pass"
          />
        </div>
        <div class="con">
          <p>ya tenes una cuenta?&nbsp;</p>
          <Link to="/login">Iniciar sesion</Link>
        </div>
      </form>
      <div className="contenedor-mensaje-de-error">
      <span>{error} </span>
      </div>
    </div>
  );
};
