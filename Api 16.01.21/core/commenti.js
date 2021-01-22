const { response, request } = require("express")
const fetch = require("node-fetch")
const express = require("express")
const e = module.exports

e.getComment = async(id,response) => {
 
  try {
    let c = await fetch("https://jsonplaceholder.typicode.com/posts")
    let dati = await fetch(`https://jsonplaceholder.typicode.com/post/${id}/comments`)
    dati = await dati.json()
    c = await c.json()
  
    let comment = await c.forEach( (e) => {
      if (e.id==id){
        response.write( `<h1>Ecco le risposte al post "${e.title}" pubblicato dall'utente ${e.userId}:</h1><br>`) 
      }  
    })
  
    let nomi = await dati.forEach( (e) => {
      response.write( `<h3>"${e.email}" ha commentato: </h3> <p>${e.body}</p><br>`)   
    })
  
    response.send(comment)
    response.send(nomi)

  } catch (error) {
    console.error(error);
  }
}




e.listaPost = async(response) => {
  try {
    let c = 1
  let x = 0
  let p = await fetch("https://jsonplaceholder.typicode.com/posts")
  p = await p.json()
  
  let post = await p.forEach( (e) => {
    
    if(x===0){
      response.write( `<h1> Ecco la lista dei post pubblicati:</h1> `)
      response.write( `<br><h1> Ecco la lista dei post pubblicati dall'utente ${e.userId} : </h1><br>`)
      x = x+1
    }

      if (e.userId==c){
       
        response.write( `<h3>"${e.title}":</h3><p>${e.body}</p><br> `)   
      }

   
      else{
        c=c+1
        response.write( `<br><h1> Ecco la lista dei post pubblicati dall'utente ${e.userId} :</h1><br> `)
        response.write( `<h3>"${e.title}":</h3><p>${e.body}</p><br> `)
    } 

  })

  response.send(post)

  } catch (error) {
    console.error(error);
   
  }
  
}








