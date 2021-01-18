const { response, request } = require("express")
const fetch = require("node-fetch")
const express = require("express")
const e = module.exports

e.getComment = async(id,response) => {
 
  let c = await fetch("https://jsonplaceholder.typicode.com/posts")
  let dati = await fetch(`https://jsonplaceholder.typicode.com/post/${id}/comments`)
  dati = await dati.json()
  c = await c.json()

  let comment = await c.forEach( (e) => {
    if (e.id==id){
      response.write( `<h1>Ecco le risposte al post "${e.title}" dell'user avente Id = ${e.userId}:</h1><br>`) 
    }  
  })

  let nomi = await dati.forEach( (e) => {
    response.write( `<h3>"${e.email}" ha commentato: </h3> <p>${e.body}</p>`)   
  })
  response.send(comment)
  response.send(nomi)
}




e.listaPost = async(response) => {
 
  let c = 1
  let x = 0
  let p = await fetch("https://jsonplaceholder.typicode.com/posts")
  p = await p.json()
  
  let post = await p.forEach( (e) => {
    
    if(x===0){
      response.write( `<h1> Ecco la lista dei post pubblicati:</h1><br> `)
      x = x+1
    }

      if (e.userId==c){
        response.write( `<h3> L'utente "${e.userId}" ha pubblicato il seguente post ( id = ${e.id} ) dal titolo "${e.title}":</h3><p>${e.body}</p> `)   
      }

   
      else{
        c=c+1
        response.write( `<h3> L'utente "${e.userId}" ha pubblicato il seguente post ( id = ${e.id} ) dal titolo ${e.title}:</h3><p>${e.body}</p> `)
    } 

  })


  response.send(post)
  
}








