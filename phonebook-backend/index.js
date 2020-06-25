require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001
const baseUrl = '/api/persons'
const dbUrl = process.env.MONGODB_URI
const dbName = 'fullstack-phonebook'
const personModel = require('./models/person')

app.use(express.json())
app.use(morgan('short'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39445323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "1243234325",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39236423122",
        id: 4
    },
]

app.get('/api/persons', (req, res)=>{
    personModel.find().then(persons=>{
        res.json(persons)
    })
})

app.post('/api/persons', (req, res)=>{
    const body = req.body
    
    if (body.name === undefined || body.number === undefined){
        res.status(403).send({error: "content missing"})
    } else {
        const newPerson = new personModel({
            name: body.name,
            number: body.number
        })
        newPerson.save().then(savedPerson=>{
            res.json(savedPerson)
        })
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
    const id = Number(req.params.id)
    const deletedId = persons.findIndex((person)=>person.id === id)
    const deletedPerson = persons.find((person)=>person.id === id)

    if ( deletedId === -1){
        res.status(404).end()
    } else {
        res.json(deletedPerson)
        console.log(persons.filter((person)=>person.id !== id))
    }
})

app.get('/info', (req, res)=>{
    const now = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${now}</p>`)
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
