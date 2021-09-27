const { Router } = require('express');
const {Dog, Temp} = require('../db.js');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
var express = require('express');
const router = Router();

router.get("/dogs",async (req, res) =>{
  var {name} = req.query
  if (!name) {
    const dog = await Dog.findAll({
          attributes: ["name"]
        })
    console.log(dog.toJSON())
    res.json(dog)
    return
  }
})
router.get("/dogs/{idRaza}")
router.get("/temperament")
router.post("/dog")
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
