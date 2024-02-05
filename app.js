import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'
const app = express()
const PORT = process.env.PORT ?? 3000

app.use(json())
app.disable('x-powered-by')
app.use(corsMiddleware())

// send a json with the movies
app.use('/movies', moviesRouter)

app.listen(PORT, () => {
    console.log(`escuchando en http://localhost:${PORT}`)
})
