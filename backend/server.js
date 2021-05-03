import express from 'express'
import cors from 'cors'
import restaurants from './api/restaurants.route.js'

const app = express()

//Use of server
app.use(cors())
app.use(express.json()) //Para que pueda leer json de los request post,get etc.

app.use('/api/v1/restaurants',restaurants)
app.use("*", (req,res)=>res.status(404).json({error:"No encontrada"}))

export default app