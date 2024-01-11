const express = require('express')
const cors = require('cors')
const crypto = require('node:crypto')
const app = express()
const PORT = process.env.PORT ?? 3000
const movies = require('./movies.json')
const {validateMovie,validateMoviePartial} = require('./schema/movies')

app.use(express.json())
app.disable('x-powered-by')
app.use(cors())

// send a json with the movies
app.get('/movies', (req, res) => {
    const {genre} = req.query
    if(genre){
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g=>g.toLowerCase()===genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if(movie) return res.json(movie)
    res.status(404).json({error: 'not found'})
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)
    if(result.error){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    const newMovie = {
        id : crypto.randomUUID(),
        ...req.body
    }
    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    const result = validateMoviePartial(req.body)
    if(result.error){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if(movieIndex === -1) return res.status(404).json({error: 'not found'})
    const movie = movies[movieIndex]
    const updatedMovie = {
        ...movie,
        ...req.body
    }
    movies[movieIndex] = updatedMovie
    res.json(updatedMovie)
})

app.delete('/movies/:id', (req, res) => {
    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if(movieIndex === -1) return res.status(404).json({error: 'not found'})
    movies.splice(movieIndex,1)
    res.status(204).end()
})

app.listen(PORT, () => {
    console.log(`escuchando en http://localhost:${PORT}`)
})
