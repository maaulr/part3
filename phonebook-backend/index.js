const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = 3001

app.use(express.json())
app.use(morgan('short'))

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
    res.json(persons)
})

app.post('/api/persons', (req, res)=>{
    const body = req.body
    const personExist = persons.find((person)=>person.id === id)
    const generateId = () => {
        const maxId = persons.length>0
            ? Math.max(...persons.map(p=>p.id))
            : 0
        return maxId + 1
    }
    const new_person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    if (body.name === undefined || body.number === undefined){
        res.status(403).send({error: "content missing"})
    } else if (personExist !== undefined){
        res.status(403).send({error: "name must be unique"})
    } else {
        res.json(new_person)
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
    const deleteId = persons.findIndex((person)=>person.id === id)

    if ( deletedId === -1){
        res.status(404).end()
    } else {
        res.json({message: "person deleted"})
    }
})

app.get('/info', (req, res)=>{
    const now = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${now}</p>`)
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
