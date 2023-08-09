const movieSchema = require('../models/movie');
const BadRequestError400 = require('../errors/BadRequestError400');
const ForbiddenError403 = require('../errors/ForbiddenError403');
const NotFoundError404 = require('../errors/NotFoundError404');

module.exports.getMovies = (req, res, next) => {
  const currentUserId = req.user._id;
  movieSchema.find({ owner: currentUserId })
  .then((movies) => {
    if(movies) return movies;
    throw new NotFoundError404('404: Данные не найдены');
  })
  .then((movies) => {
    res.status(200).send(movies);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError400('400: Передан некорректный id.'));
    } else {
      return next(err);
    }
  });
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN } = req.body;
  const owner = req.user._id;
  movieSchema.create({ country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN, owner })
    .then(() => res.status(201).send({ message: 'Фильм добавлен успешно.'}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError400('400: Переданы некорректные данные при создании фильма.'));
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
        throw new NotFoundError404('404: Фильм по указанному _id не найден.');
      }
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError403('403: Фильм невозможно удалить.'));
      }
      return movie.deleteOne().then(() => res.send({ message: 'Фильм удалён успешно.' }));
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFoundError404('404: Фильм по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError400('400: Фильм с указанным _id не найден.'));
      } else {
        return next(err);
      }
    });
};