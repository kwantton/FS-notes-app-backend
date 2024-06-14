const jwt = require('jsonwebtoken') // https://fullstackopen.com/en/part4/token_authentication#limiting-creating-new-notes-to-logged-in-users
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user') // https://fullstackopen.com/en/part4/user_administration#creating-a-new-note
// thanks to express-async-errors -library, the try-catch is no longer necessary!

const getTokenFrom = request => {  
  const authorization = request.get('authorization')  
  if (authorization && authorization.startsWith('Bearer ')) {    
    return authorization.replace('Bearer ', '')  
  }  
  return null} // https://fullstackopen.com/en/part4/token_authentication#limiting-creating-new-notes-to-logged-in-users

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    .populate('user', {username:1, name:1}) // https://fullstackopen.com/en/part4/user_administration#populate
    response.json(notes)
})

notesRouter.put('/:id', async (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedNote)
})

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)  // uses .env.SECRET for decrypting the token
  if (!decodedToken.id) {    
    return response.status(401).json({ error: 'token invalid' })  
  }  
  const user = await User.findById(decodedToken.id) // https://fullstackopen.com/en/part4/token_authentication#limiting-creating-new-notes-to-logged-in-users
  // old // const user = await User.findById(body.userId) // who created the note = User.findById(body.userId). https://fullstackopen.com/en/part4/user_administration#creating-a-new-note

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id // who created the note = User.findById(body.userId). https://fullstackopen.com/en/part4/user_administration#creating-a-new-note
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)   // https://fullstackopen.com/en/part4/user_administration#creating-a-new-note
  await user.save()                               // https://fullstackopen.com/en/part4/user_administration#creating-a-new-note

  response.status(201).json(savedNote)  // thanks to express-async-errors -library, the try-catch is no longer necessary
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
}) // thanks to express-async-errors -library, try-catch is no longer necessary

notesRouter.delete('/:id', async (request, response) => { // thanks to express-async-errors -library, the try-catch is no longer necessary!
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})



module.exports = notesRouter