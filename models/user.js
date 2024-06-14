const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // this enforces that each username be unique! c: https://fullstackopen.com/en/part4/user_administration#mongoose-schema-for-users
},
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId, // "The ids of the notes are stored within the user document as an array of Mongo ids. The definition is as follows: [type and ref here on the left c:]"
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // change from "_id" (mongo) to "id". ""Even though the _id property of Mongoose objects looks like a string, it is in fact an object. The toJSON method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm to us in the future once we start writing tests." https://fullstackopen.com/en/part3/saving_data_to_mongo_db#fetching-objects-from-the-database"
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash // otherwise this would be accessible from the returnedObject!
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User