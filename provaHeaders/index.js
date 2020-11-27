const express = require('express');
const app = express()
const port = 8000

app.get ("/", (req, res) => {
    const nome = (req.query.nome)
    const cognome = (" " + req.query.cognome)
    const anni = (req.query.anni)

    maggiorenne = () => {
        if (anni<18){
            const risposta="Risulta che tu sia minorenne"
            return(risposta)
        }
        else{
            const risposta="Risulta che tu sia maggiorenne"
            return(risposta)
        }
      }

    if (nome===undefined || cognome===undefined || anni===undefined){
        res.send("Mancano dei parametri o sono presenti errori nella tua richiesta")
        
    }
    else{
        const risposta=maggiorenne()
        const messaggio=("ciao " + nome + cognome + " tu hai " + anni + " anni"+ " <br />" + risposta )
        res.send(messaggio)
      
    }  

    
})

app.get ("/language", (req, res) => {
    const lingua = req.get("accept-language").substr(0,2)
    res.send("The default language is set on: " + lingua)
})
 

app.listen(port, () => console.log(`Server avviato sulla porta ${port}`));