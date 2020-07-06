const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI
console.log('connecting to ', url)

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result=>{
        console.log('connected to mongoDB')
    })
    .catch((error)=>{
        console.log(`error connecting to mongoDB: ${error.message}`)
    })

const personSchema = new mongoose.Schema({
    name: {type: String, min:[3, 'name is too short.'], unique:true},
    number: {type: String, min:[8, 'number is too short']}
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)