const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {    
    return response.status(400).json({ error: 'expected `username` to be unique' })  // this is to ensure that if someone attempts to create the same username twice, which will cause this MongoServerError, it will be handled appropriately - https://fullstackopen.com/en/part4/user_administration#mongoose-schema-for-users
  } else if (error.name ===  'JsonWebTokenError') {   // token validation when you're trying to send a new note - is the user logged in, that is?: https://fullstackopen.com/en/part4/token_authentication#limiting-creating-new-notes-to-logged-in-users 
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {    // see controllers/login.js for where the expiration time of 60*60 seconds is set c:
    return response.status(401).json({      
      error: 'token expired'    })  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}