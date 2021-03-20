const faker = require("faker")
const express = require("express")
const app = new express()
const PORT = 8080

//TEAM DI PROVA
const teams = {
  pippo: {
    team: "pippo",
    password: "a",
    score: 100,
    killedShips: [],
    firedBullets: 10,
    lastFiredBullet: new Date().getTime()
  }
}

const field = []
const ships = []

const W =  6
const H =  6
const S = process.argv[4] || 10

for (let y = 0; y < H; y++) {
  const row = []
  for (let x = 0; x < W; x++) {
    row.push({
      team: null,
      x,
      y,
      ship: null,
      hit: false
    })    
  } 
  field.push(row)
}

let id = 1
for (let i = 0; i < S; i++) {
  const maxHp = faker.random.number({ min: 1, max: 6 })
  const vertical = faker.random.boolean()
  //console.log({ vertical, maxHp})

  const ship = {
    id,
    name: faker.name.firstName(),
    x: faker.random.number({ min: 0, max: vertical ? W - 1 : W - maxHp }),
    y: faker.random.number({ min: 0, max: vertical ? H - maxHp : H - 1 }),
    vertical,
    maxHp,
    curHp: maxHp,
    alive: true,
    killer: null
    
  }

  let found = false
  for (let e = 0; e < ship.maxHp; e++) {
    const x = ship.vertical ? ship.x : ship.x + e
    const y = ship.vertical ? ship.y + e : ship.y
    if (field[y][x].ship) {
      found = true
      break
    }
  }

  if (!found) {
    for (let e = 0; e < ship.maxHp; e++) {
      const x = ship.vertical ? ship.x : ship.x + e
      const y = ship.vertical ? ship.y + e : ship.y
      field[y][x].ship = ship
    }
  
    ships.push(ship)
    id ++
  }
}

app.get("/", ({ query: { format } }, res) => {
  const visibleField = field.map(row => row.map(cell => ({ 
    x: cell.x,
    y: cell.y,
    hit: cell.hit,
    team: cell.team,
    ship: cell.ship ? { id: cell.ship.id, name: cell.ship.name, alive: cell.ship.alive, killer: cell.ship.killer } : null 
  })))


  const visibleShipInfo = ships.map(ship => ({
    id: ship.id,
    name: ship.name,
    alive: ship.alive,
    killer: ship.killer
  }))

  if ( format === "json") {
    res.json({ 
      field: visibleField,
      ships: visibleShipInfo
    })

  } else {
    // html format field
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>battaglia navale</title>
      <style>
        table, td, th {
          border: 1px solid black;
        }
        td {
          width: 40px;
          height: 40px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
      </style>
    </head>
    <body>
      <table>
        <tbody>
          ${visibleField.map(row => `<tr>${row.map(cell => `<td>${cell.ship ? cell.ship.name : ""}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </body>
    </html>
    `)
  }
})


//PUNTEGGIO

app.get("/score", ({ query: { team, password } }, res) => {
  if (teams[team]?.password === password) {
    res.send(teams[team])
  } else {
    res.send("password o nome utente errati")
  }
})

//FUNZIONE PER ACCREDITARSI 

app.post("/signup", ({ body: { team, password } }, res)=> {
  if (typeof team !== "string" || typeof password !== "string" || !team || !password) {
    return res.status(400).send({ msg: "Ricontrolla le credenziali inserite" })
  }

  if (teams[team]) {
    res.status(400).send({ msg: `Il nome ${team} è già stato usato, prego cambiare nome per il team` })
  } 
  
  else {
    teams[team] = {
      team, password, score: 0, killedShips: [], firedBullets: 0, lastFiredBullet: new Date().getTime()
    }
    res.status(200).send({ msg: "Accreditamento riuscito!", credentials: { team, password } })
  }
})



//FUNZIONE PER SPARARE


app.get("/fire", ({ query: { x, y, team, password } }, res) => {  
 
  const teamData = teams[team]
 
  if (x > W-1 || y > H-1 || x < 0 || y < 0) {
    teamData.score -= 20
    teamData.firedBullets +=1
    teamData.lastFiredBullet = new Date().getTime()
    return res.status(400).send({ score: teamData.score, msg: "Sei uscito dalle acque internazionali, paghi 20 punti di dogana" })
  }
  

  const cell = field[y][x]

  if (new Date().getTime()-teamData.lastFiredBullet < 1000){
    res.send( "Cannoni in ricarica!!!!!!!!!!!" )   //check sul tempo passato per sparare una pallottola
  }
  else{    
    teamData.firedBullets +=1
    teamData.lastFiredBullet = new Date().getTime()

    if (cell.ship && !cell.hit) {
      cell.hit = true
      const firedShip = cell.ship
      
      if (firedShip.curHp === 1) {
        // NAVE AFFONDATA
        
        firedShip.alive = false
        firedShip.curHp = 0
        firedShip.killer = team
        teamData.killedShips.push(firedShip)
        teamData.score += 3

        return res.status(200).send({ score: teamData.score, info: { x, y, team }, msg: `Hai affondato la la U.S.S ${firedShip.name}` })
       
      } else {
        
        // NAVE COLPITA
        firedShip.killer = team
        firedShip.curHp -= 1
        teamData.score += 1

        //console.log(firedShip.name)
        //console.log(firedShip.curHp)
        //console.log(firedShip.maxHp)

        return res.status(200).send({ score: teamData.score, info: { x, y, team }, msg: `Hai colpito la U.S.S ${firedShip.name} ma ancora funzionante, attenzione!` })
      

       
      }

    } else if (cell.hit) {
        // CELLA GIA' COLPITA
        teamData.score -= 2
        res.status(400).send({ score: teamData.score, info: { x, y, team }, msg: "Mira meglio, quella casella era già stata colpita" })
    } else {
        cell.hit = true
        res.status(200).send({ score: teamData.score, info: { x, y, team }, msg: "Nessun bersaglio in questa casella" })
      }
  }
})
  
  

app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => console.log("App listening on port %O", PORT))