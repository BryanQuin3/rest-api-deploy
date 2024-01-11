const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        required_error: 'Title is required'
    }).min(1).max(100),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western','Sci-Fi']),
        {
            required_error: 'Genre is required'
        }

    ),
    year: z.number({
        required_error: 'Year is required'
    }).min(1888).max(2077),
    director: z.string({
        required_error: 'Director is required'
    }).min(1).max(50),
    duration: z.number().positive(),
    poster: z.string().url(),
    rate: z.number().min(0).max(10).default(5)
})

function validateMovie(object){
    return movieSchema.safeParse(object)
}

function validateMoviePartial(object){
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validateMoviePartial
}