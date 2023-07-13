const { celebrate, Joi } = require('celebrate');
const link = /(https?:\/\/)(w{3}\.)?\w+[-.~:/?#[\]@!$&'()*+,;=]*#?/;
const number = /^\d+$/;

module.exports.createMovieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.string().required().min(2).pattern(number),
    year: Joi.string().required().min(2),
    description: Joi.string().required().min(2),
    image: Joi.string().required().pattern(link),
    trailerLink: Joi.string().required().pattern(link),
    thumbnail: Joi.string().required().pattern(link),
    movieId: Joi.string().required().min(2),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2)
  }),
})

module.exports.movieIdValidate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
})

module.exports.userValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
})

module.exports.createUserValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
  }),
})