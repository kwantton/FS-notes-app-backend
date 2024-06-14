const Note = require('../models/note')
const User = require('../models/user')  // https://fullstackopen.com/en/part4/user_administration#mongoose-schema-for-users

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {  // https://fullstackopen.com/en/part4/user_administration#mongoose-schema-for-users
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = {
  initialNotes, 
  nonExistingId, 
  notesInDb,
  usersInDb // https://fullstackopen.com/en/part4/user_administration#mongoose-schema-for-users
}