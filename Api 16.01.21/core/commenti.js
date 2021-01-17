const e = module.exports

e.getComment = (id) => {
 
  const comment  = {
    Postid: "",
    Username: "",
    comment: ""
  }

  if (comment) {
    return `<h1>${comment.id}</h1><p>${comment.name}$</p>`
  } else {
    return null
  }
}


