import 'dotenv/config'

export const CORS_FRONTEND =  process.env.CORS_FRONTEND || "http://localhost:5173"
export const PORT =  process.env.PORT || 3000 

console.log(CORS_FRONTEND)
console.log(PORT)
