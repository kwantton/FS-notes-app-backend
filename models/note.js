const mongoose = require('mongoose') // mongodb (from npm install mongoose; mongodb atlas on the web = cloud.mongodb.com).
const config = require('../utils/config') // IMPORTANT! NOTE! I REQUIRED THIS TO GET THE CORRECT url IN CASE OF TEST c:

mongoose.set('strictQuery', false)

const url = config.MONGODB_URI // (1) IMPORTANT! NOTE! I FIXED THIS SO IT'S NO LONGER process.env.MONGODB_URI, since (!) in config (and package.json scripts!) we've established that if process.env.NODE_ENV === 'test', then we are using process.env.TEST_MONGODB_URI as config.MONGODB_URI (i.e., config.MONGODB_URI = process.env.TEST_MONGODB_URI), not MONGODB_URI = MONGODB_URI c: (2) older: "It's not a good idea to hardcode the address of the database into the code, so instead the address of the database is passed to the application via the MONGODB_URI environment variable." This is stored in root/.env of the git c:

console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true  // enforces that all these are true!
  },
  important: Boolean,
  user: {    
    type: mongoose.Schema.Types.ObjectId,    
    ref: 'User'  
  } // https://fullstackopen.com/en/part4/user_administration#mongoose-schema-for-users
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id // "Even though the _id property of Mongoose objects looks like a string, it is in fact an object. The toJSON method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm to us in the future once we start writing tests." https://fullstackopen.com/en/part3/saving_data_to_mongo_db#fetching-objects-from-the-database
    delete returnedObject.__v // "The versionKey is a property set on each document when first created by Mongoose. This keys value contains the internal revision of the document. The name of this document property is configurable. The default is __v." SO, I suppose the point is, that we don't need __v in a RETURNED object, so just get rid of it
  }
})

module.exports = mongoose.model('Note', noteSchema)