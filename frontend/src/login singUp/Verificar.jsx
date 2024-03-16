import React from "react"
import { useContext } from "react"
import { Outlet,Navigate } from "react-router-dom"
import { contextoSingUp } from "../Contextos/ProviderSIngUp"

export const Verificar = () => {
   const {accesoApp} = useContext(contextoSingUp)
   return accesoApp ?   <Outlet/> : <Navigate to="/singUp"/> 
}
