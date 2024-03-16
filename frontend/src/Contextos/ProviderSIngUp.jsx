import React from 'react';
import { useState,createContext } from "react"

export const contextoSingUp = createContext()

export const ProviderSIngUp = ({children}) => {
  const [accesoApp,setAccesoApp] = useState(true)
  return (
    <contextoSingUp.Provider value={{accesoApp,setAccesoApp}} >
        {children}
      </contextoSingUp.Provider >
    )
}
