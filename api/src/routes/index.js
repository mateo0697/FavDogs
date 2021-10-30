require("dotenv").config();
const { API_KEY } = process.env;
const { Router } = require('express');
const {Dog, Temp} = require('../db.js');
const axios = require("axios")
var express = require('express');
const router = Router();
const { Op } = require("sequelize");

function ordenarWeight(string, a){
  if (string.length > 2) {
    if (a.name === "Olde English Bulldogge") {
      return string.split("–").map(a=>a.trim()).map(a=>parseInt(a)).map((a,b,c)=> ((c[0]+c[1])/2) )[0]
    }
    if (a.name === "Smooth Fox Terrier") {
      return parseInt(string.split("-").map(a=>a.trim())[1])
    }
    return string.split("-").map(a=>a.trim()).map(a=>parseInt(a)).map((a,b,c)=> ((c[0]+c[1])/2) )[0]
  }else {
    return parseInt(string)
  }
}
function ordenar(arr){
  let ordenados = arr.map(p=>{
    return{
      id:p.id,
      name:p.name,
      image:p.image,
      temperament:p.temperament,
      height:p.height,
      weight:p.weight,
      weightCOMP:ordenarWeight(p.weight.imperial, p)
    }
  })
  return ordenados
}
async function subirtemp(obj){
  if (obj.temperament) {
    var temps = obj.temperament.split(",").map(d=>d.trim())
    temps.forEach(async (tempe) => {
      const [player, created] = await Temp.findOrCreate({
        where: {name:tempe},
});
    });
  }else {
    return
  }
}

async function mandar(array){
    var hola = await array.forEach((item) => {subirtemp(item)})
}

function armarPerro(hmax, hmin, wmax, wmin, n, lp){
  var height = {
    imperial: `${hmin.imperial} - ${hmax.imperial}`,
    metric: `${hmin.metric} - ${hmax.metric}`
  }
  var weight = {
    imperial: `${wmin.imperial} - ${wmax.imperial}`,
    metric: `${wmin.metric} - ${wmax.metric}`
  }
  var weightCOMP = (wmin.imperial + wmax.imperial)/2
  return({height, weight, weightCOMP, name:n, life_span:lp})
}
//------------------------------------------------------------------------------
router.post("/temps",async (req,res) =>{
  try{
    let temp = await Temp.findAll()
    const esperar = req.body
    if (temp.length === 0) {
      await mandar(esperar)
    }
    temp = await Temp.findAll()
    res.json({temp})
  }catch(e){
    res.status(400).json(e)
  }
})

router.get("/dogs/",async (req, res) =>{
    let {name} = req.query
    var link;
    let dog;
    if (name) {
      link = `https://api.thedogapi.com/v1/breeds/search?q=${name}&api_key=${API_KEY}`
      dog = await Dog.findAll({
        where:{
          name:{
            [Op.regexp]:`(${name})`
          }
        },
        include:Temp
      })
    }else {
      link = `http://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`
      dog = await Dog.findAll({
        include:Temp
      })
    }
      let esperar = await axios.get(link)
        .then(r => r.data)
        .then(r => {
        return r
        })
      let final = await ordenar(esperar)
      if (dog) {
        res.status(200).json({perros: final, perrosnuevos:dog})
      }else {
        res.status(200).json({perros: final, perrosnuevos:[]})
      }
})


router.get("/dogs/:id", async(req,res)=>{
  const {id} = req.params
  res.json({})
})


router.post("/dog", async (req, res)=>{
  console.log(req.body)
  const {name, heightmin, heightmax, weightmin, weightmax, life_span, temperament}=req.body
  const team = await Dog.create(armarPerro(heightmax,heightmin, weightmax,weightmin,name, life_span));
 if (temperament.length) {
   const x = await Temp.findAll({
     where:{
       name:{[Op.or]:temperament}
     }
   })
   await team.addTemps(x)
 }

  res.json(team);

})


module.exports = router;
