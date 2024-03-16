import React from 'react';
import { useState,createContext } from "react"
export const contextoTareas = createContext()

export const ProviderTareas = ({children}) => {
    
  const [tareaUser,setTareaUser] = useState([])

  return (
    <contextoTareas.Provider value={{tareaUser,setTareaUser}} >
        {children}
      </contextoTareas.Provider >
    )
}
