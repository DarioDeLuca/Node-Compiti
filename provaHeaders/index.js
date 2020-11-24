const express = require('express');
const app = express()
const port = 8000

app.get ("/", (req, res) => {
    const nome = (req.query.nome)
    const cognome = (" " + req.query.cognome)
    const anni = (req.query.anni)
    if (nome===undefined || cognome===undefined || anni===undefined){
        res.send("Mancano dei parametri o sono presenti errori nella tua richiesta")
    }
    else{
        res.send("ciao " + nome + cognome + " tu hai " + anni + " anni" )
    }  
})

app.get ("/language", (req, res) => {
    const lingua = req.get("accept-language").substr(0,2)
    res.send("The default language is set on: " + lingua)
})
 

app.listen(port, () => console.log(`Server avviato sulla porta ${port}`));