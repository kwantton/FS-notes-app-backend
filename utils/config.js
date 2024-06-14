require('dotenv').config()

const PORT = process.env.PORT // environment variable PORT, defined in .env of the root folder! NEVER share that folder in GitHub - include it in .gitignore
const MONGODB_URI = process.env.NODE_ENV === 'test'   
  ? process.env.TEST_MONGODB_URI   // if NODE_ENV is 'test' then use the TEST_MONGODB_URI, if NODE_ENV is not 'test', use the actual dev build / production build MONGODB_URI for the 'actual' database
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT // should be 3001
}