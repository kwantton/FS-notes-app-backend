const bcrypt = require('bcrypt') // https://fullstackopen.com/en/part4/user_administration#mongoose-schema-for-users
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
  })

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    .populate('notes', {'content':1, 'important':1})  // https://fullstackopen.com/en/part4/user_administration#populate . Choose only 'content' and 'important' fields of each note to be shown when you access /api/users c:
    response.json(users)
  })



module.exports = usersRouter