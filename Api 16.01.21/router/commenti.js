const express = require("express")
const router = new express.Router()
const fetch = require("node-fetch")
const { getComment } = require("../core/commenti")

router.get("/", async(req,res) => {
    let dati = await fetch('https://jsonplaceholder.typicode.com/posts')
    dati = await dati.json()
    res.send(dati)
})


router.get("/post/:id", async (req, res) => {
  const id = req.params.id
  let dati = await fetch(`https://jsonplaceholder.typicode.com/post/${id}/comments`)
  dati = await dati.json()
  res.send(dati)

})


module.exports= router