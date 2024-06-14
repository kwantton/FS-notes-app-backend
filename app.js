const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // " You introduce the library in app.js, BEFORE you import your routes:" (https://fullstackopen.com/en/part4/testing_the_backend#async-await)
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users') // https://fullstackopen.com/en/part4/user_administration#mongoose-schema-for-users
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const loginRouter = require('./controllers/login')  // https://fullstackopen.com/en/part4/token_authentication
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist')) // production build of the frontend is in 'dist'
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter) // https://fullstackopen.com/en/part4/user_administration#mongoose-schema-for-users
app.use('/api/login', loginRouter) // https://fullstackopen.com/en/part4/token_authentication

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app