import {useState } from "react";
import React from "react";


export const SingUp = () => {
  // estados del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //errores que tira el servidor
  const [error, setError] = useState("");

  // todas la  funciones  
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
      // Validación de longitud mínima de contraseña
      else if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
      } else {
  
        
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
        if (!response.ok) console.log("erro al resivir los datos");
        else {
          const data = await response.json();
            setError(data.mensaje);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  return (
    <div>
      <h1>singUp</h1>
      <form onSubmit={fromSingUp}>
        <div>
          <label htmlFor="nombre">nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">enviar</button>
      </form>
      <span>{error} </span>
    </div>
  );
};
