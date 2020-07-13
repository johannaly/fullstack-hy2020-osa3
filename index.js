const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
// const { response } = require('express')
// const { collection } = require('./models/person')

//const password = process.argv[2]
//const name = process.argv[3]
//const number = process.argv[4]
//const persons= []

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
//app.use(logger)

// eslint-disable-next-line no-unused-vars
morgan.token('body', function (request, response) {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//haetaan kaikki
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

//haetaan info
app.get('/info', (request, response) => {
  Person.countDocuments(function (err, count) {
    if(err) {
      console.log(err)
    } else {
      const date = new Date()
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end(`Phonebook has info for ${count} people \n${date}`)
    }
  })
})

//haetaan yksittäinen tieto
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//poistetaan yksittäinen tieto
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  // eslint-disable-next-line no-unused-vars
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//muutetaan yksittäistä numeroa
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
    id: request.params.id
  }

  Person.findByIdAndUpdate(request.params.id, person, { new:true })
    .then(updatedPerson => {
      console.log(updatedPerson)
      console.log(updatedPerson.id)
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//lisätään uusi tieto
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body) {
    return response.status(400).json({
      error: 'content is empty'
    })
  } else {
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person
      .save()
      .then(savedPerson => savedPerson.toJSON())
      .then(saveAndFormattedPerson => {
        response.json(saveAndFormattedPerson)
      })
      .catch(error => next(error))
  }
})

//tuntemattomat osoitteet
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

//virheelliset pyynnöt
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
