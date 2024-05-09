const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors') // not very safe!! This allows for CORS from all URLs!
app.use(cors())

app.use(express.static('dist')) // NEEDED FOR SERVING STATIC FILES FROM THE BACKEND https://fullstackopen.com/en/part3/deploying_app_to_internet 

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger) // this has to be AFTER the definition of requestLogger above, ofc c:
//app.use(morgan('combined')) // https://github.com/expressjs/morgan "examples"-section

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log({id})
  const note = notes.find(note => {
  console.log(note.id, typeof note.id, id, typeof id, note.id === id)
  return note.id === id})
console.log({note})

if (note) {    
response.json(note)  
} else {    
response.status(404).end()
}
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => { // THIS IS LAST, BECAUSE THIS WILL ONLY BE EXECUTED IF NONE OF THE PATHS ABOVE HAVE BEEN EXECUTED! c:
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint) //   first definition above, THEN use c: 

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

const PORT = process.env.PORT || 3001; // environment variable PORT, OR 3001 if env.var.PORT is not defined
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
