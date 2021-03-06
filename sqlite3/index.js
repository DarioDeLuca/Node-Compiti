const sqlite3 = require("sqlite3")
const express = require ("express")
const app = new express()
app.use(express.json())


const db = new sqlite3.Database(':memory:') 

db.serialize(()=> {
  db.run("CREATE TABLE user (username TEXT, password TEXT)");

  var stmt = db.prepare("INSERT INTO user VALUES (?,?)")
  for (var i = 0; i < 10; i++) {
      stmt.run("utente" + i, "password"+i)
  }
  stmt.finalize()
})

app.post("/login",(req,res)=>{
    const { user, pwd } = req.body

    db.get("SELECT * FROM user WHERE username = ? AND password = ?",user,pwd,(err,row)=>{
        if (err) console.log(err)
        else{
            if (row) res.json({status : 200, ok: "true"})
            else res.json({status : 401, ok: "false"})
        }
    })
})

app.listen(8080,()=>{console.log('server listening on port 8080')})