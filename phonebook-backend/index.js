require('dotenv').config()
const express = require('express')
// const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001
// const baseUrl = '/api/persons'
// const dbUrl = process.env.MONGODB_URI
// const dbName = 'fullstack-phonebook'
const personModel = require('./models/person')

app.use(express.json())
app.use(morgan('short'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        name: 'Arto Hellas',
        number: '040123456',
        id: 1
    },
    {
        name: 'Ada Lovelace',
        number: '39445323523',
        id: 2
    },
    {
        name: 'Dan Abramov',
        number: '1243234325',
        id: 3
    },
    {
        name: 'Mary Poppendieck',
        number: '39236423122',
        id: 4
    },
]

app.get('/api/persons', (req, res)=>{
    personModel.find().then(persons=>{
        res.json(persons)
    })
})

app.post('/api/persons', (req, res, next)=>{
    const body = req.body
    
    if (body.name === undefined || body.number === undefined){
        res.status(403).send({error: 'content missing'})
    } else {
        const newPerson = new personModel({
            name: body.name,
            number: body.number
        })
        newPerson.save().then(savedPerson=>{
            res.json(savedPerson)
        })
            .catch(error=>next(error))
    }
})

app.get('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    const person = persons.find((person)=>person.id === id)

    if (person === undefined){
        res.status(404).end()
    } else {
        res.json(person)
    }
})

app.delete('/api/persons/:id', (req, res)=>{
    const id = req.params.id
    let deletedPerson = ''
    const findPerson = personModel.findById(id).then(person=>{
        deletedPerson = person
    })

    personModel.findByIdAndRemove(id).then(result=>{
        res.json(deletedPerson)
    }).catch(error=>console.log(error))
})

app.put('/api/persons/:id', (req, res, next)=>{
    const id = req.params.id
    const body = req.body

    const updatePersonData = {
        name: body.name,
        number: body.number
    }

    personModel.findByIdAndUpdate(id, updatePersonData, {new: true})
        .then(updatedPerson=>{
            res.json(updatedPerson.toJSON())
        })
        .catch(error=>next(error))
})

app.get('/info', (req, res)=>{
    const now = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${now}</p>`)
})

const unknownEndpoint = (req, res)=>{
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next)=>{
    console.log(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId'){
        return res.status(400).send({error: 'malformatted id'})
    }
    else if (error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
