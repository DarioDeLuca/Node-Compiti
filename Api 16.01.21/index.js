const express = require("express")
const  commenti = require("./router/commenti")
const fs = require("fs")
const port = 8080
const app = new express()

app.use("/", commenti)


app.listen(port, () => console.log(`Server avviato sulla porta ${port}`));