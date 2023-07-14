const movieRoutes = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { createMovieValidate, movieIdValidate } = require('../middlewares/validator');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', createMovieValidate, createMovie);
movieRoutes.delete('/:movieId', movieIdValidate, deleteMovie);

module.exports = movieRoutes;