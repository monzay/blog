import React from 'react';
import {contextoSingUp} from "../Contextos/ProviderSIngUp"
import {useContext,useState} from "react"
export const Login = () => {


  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {setAccesoApp} = useContext(contextoSingUp)

  const fromLogin = async (e) => {
    e.preventDefault();
    try {
      
      if (email && password) {
        const credencialesUser = {
          email,
          password,
        };

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
          localStorage.setItem("credenciales",JSON.stringify(data.credenciales));
          setAccesoApp(data.token)
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>login</h1>
      <form onSubmit={fromLogin}>
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
    </div>
  );
};
