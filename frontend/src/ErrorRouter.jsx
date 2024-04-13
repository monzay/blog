import React from 'react'
import { useNavigate } from 'react-router-dom'

export const ErrorRouter = () => {
    const navegate = useNavigate()
    useEffect(() => {
    navegate("/singUp")
    }, [])
    
  return (
    <div> ESTA PAGINA NO EXITE </div>
  )
}
