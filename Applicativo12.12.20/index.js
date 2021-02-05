const express = require('express');
const app = new express();
const fs = require("fs")
const port = 8080

app.use(express.static(__dirname + '/public'));

app.get("/", (req,res) => {
    res.sendFile(__dirname +'/public/home.html');
  })

app.listen(port, () => console.log(`Server avviato sulla porta ${port}`));