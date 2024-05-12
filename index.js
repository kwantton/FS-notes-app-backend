const express = require('express') // library for server-side development
const app = express()
require('dotenv').config() // needed for accessing environment variables! "It's important that dotenv gets imported before the note model is imported. This ensures that the environment variables from the .env file are available globally before the code from the other modules is imported." https://fullstackopen.com/en/part3/saving_data_to_mongo_db#fetching-objects-from-the-database

const Note = require('./models/note')

let notes = [] // "notes" is no longer needed. If you were to write something here, this default content would be overwritten by the content of MongoDB NoteApp -database, so these won't be shown c:

app.use(express.static('dist')) // NEEDED FOR SERVING STATIC FILES FROM THE BACKEND https://fullstackopen.com/en/part3/deploying_app_to_internet 

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const cors = require('cors') // not very safe! This allows for CORS from all URLs! But needed in our case..

app.use(cors())

app.use(express.json())
app.use(requestLogger) // this has to be AFTER the definition of requestLogger above, ofc c:
//app.use(morgan('combined')) // https://github.com/expressjs/morgan "examples"-section

app.get('/', (request, response) => {
  response.send(`
  <h1>Hello! Welcome to the notes app</h1>
  <p>
  for notes, see <a href='/api/notes'>notes</a>
  </p>
  `)
})

app.get('/api/notes', (request, response) => { // "The code automatically uses the defined toJSON when formatting notes to the response." thanks to the above toJSON
  Note.find({}).then(notes => { // NB! Note is imported from ./models/note. So this now uses MongoDB! (Note.find... part!)
    response.json(notes)
  })
})

app.post('/api/notes', (request, response, next) => { // remember "next"!
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
  .catch(error => next(error)) // the mongoose checks (length at least 5, AND content must be provided)
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if (note) {        
      response.json(note)      
    } else {        
      response.status(404).end()      
    }    
  })
  .catch(error => next(error))    
  })

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body
  const body = request.body

  Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => { // THIS IS LAST, BECAUSE THIS WILL ONLY BE EXECUTED IF NONE OF THE PATHS ABOVE HAVE BEEN EXECUTED! c:
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint) //   first definition above, THEN use c: 

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {    // mongoose validation error (too short, or content missing!) -> this handles it c:
    return response.status(400).json({ error: error.message })  
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this! (https://fullstackopen.com/en/part3/saving_data_to_mongo_db#error-handling)
app.use(errorHandler)

const PORT = process.env.PORT // environment variable PORT, defined in .env of the root folder! NEVER share that folder in GitHub - include it in .gitignore
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
