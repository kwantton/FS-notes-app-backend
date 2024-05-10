require('dotenv').config() // needed for accessing environment variables! "It's important that dotenv gets imported before the note model is imported. This ensures that the environment variables from the .env file are available globally before the code from the other modules is imported." https://fullstackopen.com/en/part3/saving_data_to_mongo_db#fetching-objects-from-the-database
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist')) // NEEDED FOR SERVING STATIC FILES FROM THE BACKEND https://fullstackopen.com/en/part3/deploying_app_to_internet 

const cors = require('cors') // not very safe! This allows for CORS from all URLs! But needed in our case..
app.use(cors())

const Note = require('./models/note')

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

app.get('/api/notes', (request, response) => { // "The code automatically uses the defined toJSON when formatting notes to the response." thanks to the above toJSON
  Note.find({}).then(notes => { // NB! Note is imported from ./models/note. So this now uses MongoDB! (Note.find... part!)
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
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

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({ // this uses MongoDB! ofc..
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => { // mongoDB
    response.json(savedNote)
  })
})

const PORT = process.env.PORT; // environment variable PORT, defined in .env of the root folder! NEVER share that folder in GitHub - include it in .gitignore
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
