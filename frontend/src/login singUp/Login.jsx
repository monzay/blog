import React from 'react';
import {contextoSingUp} from "../Contextos/ProviderSIngUp"
import {useContext,useState} from "react"
import { useEffect } from 'react';
import {Link} from "react-router-dom"
import { useNavigate } from 'react-router-dom';


export const Login = () => {

  //  VEMOS SI EL USUARIO TIENE CREDENCIALES  PARA REDERIGIR A LA APP 
  const  redirigirApp = useNavigate()
  useEffect(() => {
     const credenciales = JSON.parse( localStorage.getItem("credenciales"))
     if(credenciales){
      if(credenciales.token) return redirigirApp("/app")
     }
  }, [])
  

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {setAccesoApp} = useContext(contextoSingUp)


  const navegate  = useNavigate()


  const fromLogin = async (e) => {
    e.preventDefault();
    try {
      // validaciones
      if (email && password) {
        const credencialesUser = {
          email,
          password,
        };


        // POST 
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credencialesUser),
        });

        if (!response.ok) {
          console.log("Error al recibir los datos");
        } else {
          const data = await response.json();
          setError(data.mensaje)
          console.log(data)
          localStorage.setItem("credenciales",JSON.stringify(data.credenciales));
          setAccesoApp(data.token)
          navegate("/app")
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="contenedor-from">
    <form class="form" onSubmit={fromLogin}>
      <p class="login">Iniciar sesion </p>
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
      <div class="forget">olvidaste la contraseña?</div>
      <div class="con">
        <p>no tenes una cuenta?&nbsp;</p>
        <Link to="/singUp">resgistrarse</Link>
      </div>
    </form>
    <div className="contenedor-mensaje-de-error">
    <span>{error} </span>
    </div>
  </div>
    // <div>
    //   <h1>login</h1>
    //   <form onSubmit={fromLogin}>
    //     <div>
    //       <label htmlFor="email">email</label>
    //       <input
    //         id="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //       ></input>
    //     </div>
    //     <div>
    //       <label htmlFor="password">password</label>
    //       <input
    //         type="text"
    //         id="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //     </div>
    //     <button type="submit">enviar</button>
    //   </form>
    // </div>
  );
};
