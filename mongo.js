const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2] // 3rd argument, input from the command line, should be the password (the above checks if there even are 3 arguments or fewer). See the mysterious pw file for your MongoDB Atlas database password (database password, not the site password, btw)

// const url1 = `mongodb+srv://anttonkasslin:${password}@cluster0.k9nljxh.mongodb.net/?retryWrites=true&w=majority&appName=noteApp` // NB!! Depends on your actual address // THIS WILL NOT RENAME IT SUCCESFULLY.

// NB!! I'VE SWITCHED THE ADDRESS BELOW TO "noteAppBackendTesting" FOR UTILIZATION IN CREATION OF NOTES TO THAT SPECIFIC ADDRESS IN PART 4 "Let's add two notes to the test database using the mongo.js program (here we must remember to switch to the correct database url)" https://fullstackopen.com/en/part4/testing_the_backend#supertest

                                                                        // NB!!!!!!!!!!!!!//
const url =                                                             //↓ change this ↓ // according to need (noteApp for "actual" database, noteAppBackendTesting for backend testing c:)
  `mongodb+srv://anttonkasslin:${password}@cluster0.k9nljxh.mongodb.net/noteAppBackendTesting?retryWrites=true&w=majority` // this will rename it succesfully as "noteApp". The above won't. This is directly from the course material c:

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)


/************************** CREATING NOTES c: ******************/
let note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('HTML note saved!')
})

note = new Note({
  content: 'awesome :D',
  important: false,
})

note.save().then(result => {
  console.log('awesome note saved!')
  mongoose.connection.close()
})
  /** */


/** LISTING NOTES 

Note.find({ important:false }).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

*/