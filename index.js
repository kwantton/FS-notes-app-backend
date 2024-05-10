require('dotenv').config() // needed for accessing environment variables! "It's important that dotenv gets imported before the note model is imported. This ensures that the environment variables from the .env file are available globally before the code from the other modules is imported." https://fullstackopen.com/en/part3/saving_data_to_mongo_db#fetching-objects-from-the-database
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist')) // NEEDED FOR SERVING STATIC FILES FROM THE BACKEND https://fullstackopen.com/en/part3/deploying_app_to_internet 

const cors = require('cors') // not very safe! This allows for CORS from all URLs! But needed in our case..
app.use(cors())

const Note = require('./models/note')

/* OBSOLETE since we're now using .env (environment variables) AND importing Note from ./models/note c:
const mongoose = require('mongoose') // mongodb (from npm install mongoose; mongodb atlas on the web = cloud.mongodb.com).
if (process.argv.length<3) {
  console.log('for mongoose, give password as the 3rd argument')
  process.exit(1)
}
const password = process.argv[2] // 3rd argument, input from the command line, should be the password (the above checks if there even are 3 arguments or fewer). See the mysterious pw file for your MongoDB Atlas database password (database password, not the site password, btw)
// const url1 = `mongodb+srv://anttonkasslin:${password}@cluster0.k9nljxh.mongodb.net/?retryWrites=true&w=majority&appName=noteApp` // NB!! Depends on your actual address // THIS WILL NOT RENAME IT SUCCESFULLY unlike the used one right above this one c:.
const url =
  `mongodb+srv://anttonkasslin:${password}@cluster0.k9nljxh.mongodb.net/noteApp?retryWrites=true&w=majority` // this will rename it succesfully as "noteApp". The above won't. This is directly from the course material c:
mongoose.set('strictQuery',false)
mongoose.connect(url)
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // "Even though the _id property of Mongoose objects looks like a string, it is in fact an object. The toJSON method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm to us in the future once we start writing tests." https://fullstackopen.com/en/part3/saving_data_to_mongo_db#fetching-objects-from-the-database 
    delete returnedObject._id
    delete returnedObject.__v // "The versionKey is a property set on each document when first created by Mongoose. This keys value contains the internal revision of the document. The name of this document property is configurable. The default is __v." SO, I suppose the point is, that we don't need __v in a RETURNED object, so just get rid of it
  }
})
const Note = mongoose.model('Note', noteSchema) // finds all current notes
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
app.get('/api/notes', (request, response) => { // "The code automatically uses the defined toJSON when formatting notes to the response." thanks to the above toJSON
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
*/

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

const PORT = process.env.PORT; // environment variable PORT, defined in .env of the root folder! NEVER share that folder in GitHub - include it in .gitignore
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
