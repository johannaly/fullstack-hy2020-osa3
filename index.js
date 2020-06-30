const express = require('express')
const { response } = require('express')
const app = express()

const persons = [
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

app.get('/', (request, response) => {
    console.log("Hallo, täällä ollaan")
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const numberOfPersons = persons.length
    const date = new Date() 
    response.writeHead(200, {'Content-Type': 'text/plain'})
    response.end(`Phonebook has info for ${numberOfPersons} people \n${date}`)
})

const PORT = 3001
app.listen(PORT)
