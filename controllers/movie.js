const movieSchema = require('../models/movie');
const BadRequestError400 = require('../errors/BadRequestError400');
const ForbiddenError403 = require('../errors/ForbiddenError403');
const NotFoundError404 = require('../errors/NotFoundError404');

module.exports.getMovies = (req, res, next) => {
  movieSchema.find({})
  .then((movies) => {
    const arr = movies.map((movie) => {
      if(movie.owner === req.user._id) {
        return movie;
      }
      return;
    });
    return arr;
  })
  .then((movies) => {
    res.status(200).send(movies);
  })
  .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN } = req.body;
  const owner = req.user._id;
  movieSchema.create({ country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN, owner })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError400('Переданы некорректные данные при создании фильма.'));
      } else {
        return next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  movieSchema.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError404('Фильм по указанному _id не найден.');
      }
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError403('Фильм невозможно удалить.'));
      }
      return movie.deleteOne().then(() => res.send({ message: 'Фильм был удален.' }));
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFoundError404('Фильм по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError400('Фильм с указанным _id не найден.'));
      } else {
        return next(err);
      }
    });
};