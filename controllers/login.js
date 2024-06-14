const jwt = require('jsonwebtoken') // THIS login.js: https://fullstackopen.com/en/part4/token_authentication //
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(  // a token is created and signed with the .env.SECRET
    userForToken,     
    process.env.SECRET,    
    { expiresIn: 60*60 }  ) // "The token has been digitally signed using a string from the environment variable SECRET as the secret. The digital signature ensures that only parties who know the secret can generate a valid token. The value for the environment variable must be set in the .env file. - -the environment variable SECRET. It can be any string. " https://fullstackopen.com/en/part4/token_authentication 

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter