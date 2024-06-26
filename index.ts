import {sequelize} from "./db/index"
import { index } from "./lib/algolia"
import { Comercio } from "./db/comercio"
import * as dotenv from "dotenv"
dotenv.config()

const express = require('express')


const port = process.env.PORT ||3003
const app = express()

sequelize.sync({alter:true})
app.use(express.json())


app.post("/comercios", async (req,res)=>{
  const newComercio = await Comercio.create(req.body)
  const algoliaRes = await index.saveObject({
    objectID: newComercio.get("id"),
    nombre: newComercio.get("nombre"),
    _geoloc:{
      lat: newComercio.get("lat"),
      lng: newComercio.get("lng")
    }
  })
  res.json(newComercio)
})

app.get("/comercios", async (req,res)=>{
  const todos = await Comercio.findAll({})
  res.json(todos)
})

app.get("/comercios/:id", async (req,res)=>{
  const comercio = await Comercio.findByPk(req.params.id)
  res.json(comercio)
})

function bodyToIndex(body, id?){
  const respuesta:any={}
  if (body.nombre){
    respuesta.nombre = body.nombre
  }
  if (body.rubro){
    respuesta.rubro = body.rubro
  }
  if(body.lat && body.lng){
    respuesta._geoloc = {
      lat: body.lat,
      lng: body.lng
    }
  }
  if(id){
    respuesta.objectID = id
  }
  return respuesta
}

app.put("/comercios/:id", async (req,res)=>{
  const [comercio] = await Comercio.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  // const updatedData = await Comercio.findByPk(req.params.id)
  const indexItem = bodyToIndex(req.body, req.params.id)
  const algoliaRes = await index.partialUpdateObject(indexItem)
  res.json(comercio)
})

app.get("/comercios-cerca-de", async (req,res)=>{
  const {lat,lng} = req.query
  const {hits} = await index.search("",{
    aroundLatLng: [lat,lng].join(","),
    aroundRadius: 10000
  })

  res.json(hits)
})

app.get("*",express.static(__dirname+"/public"))

const variableEntorno = process.env.TOKEN 

app.listen(port, ()=>{
  console.log("Variable de entorno: ",variableEntorno)
  console.log("Todo esta ok en el puerto: ", port)
})
