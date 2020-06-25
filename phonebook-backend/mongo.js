const mongoose = require('mongoose')
const db_name = 'fullstack-phonebook-test'

if (process.argv.length < 3) {
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstackopen-maulr:${password}@cluster0-povgw.mongodb.net/${db_name}?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const PersonModel = mongoose.model('Person', personSchema)

switch (process.argv.length) {
    case 4:
        console.log('incomplete argument, name/number required.')
        process.exit(1)
        break;
    case 5:
        const person = new PersonModel({
            name: process.argv[3],
            number: process.argv[4]
        })
        person.save().then(result=>{
            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook.`)
            mongoose.connection.close()
        })
        break;
    default:
        PersonModel.find().then(res=>{
            console.log('phonebook:')
            res.forEach(person=>{
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}