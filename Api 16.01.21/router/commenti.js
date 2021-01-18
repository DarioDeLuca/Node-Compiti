const express = require("express")
const router = new express.Router()
const fetch = require("node-fetch")
const { getComment,listaPost } = require("../core/commenti")


router.get("/", async(req,res) => {
  listaPost(res)
})


router.get("/post/:id", async (req, res) => {
  const id = await req.params.id
  getComment(id, res)
})

module.exports= router