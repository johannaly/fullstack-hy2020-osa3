require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
 
//const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function(request, response) { 
    return JSON.stringify(request.body)
})

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },

    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },

    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },

    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const numberOfPersons = persons.length
    const date = new Date() 
    response.writeHead(200, {'Content-Type': 'text/plain'})
    response.end(`Phonebook has info for ${numberOfPersons} people \n${date}`)
})

app.get('/api/persons/:id', (request, response) => {
    people.findById(request.params.id).then(person => {
        response.json(person)
    })
    //const id = Number(request.params.id)
    //const person = persons.find(p => p.id === id)

   /* if(person) {
        response.json(person)
    }  else {
        response.status(404).end()
    }*/
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
    //console.log(persons)
})

const generateId = () => {
    return Math.floor(Math.random() * Math.floor(10000))
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body) {
        return response.status(400).json({
            error: "content is empty"
        })
    } /*else if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        })
    } else if (persons.map(p => p.name).includes(body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    } */ else {
    const person = new Person({
        name: body.name,
        number: body.number,
        //id: generateId()
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

    persons = persons.concat(person)
    //response.json(person) 
    }
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
