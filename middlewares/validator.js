const { celebrate, Joi } = require('celebrate');
const link = /(https?:\/\/)(w{3}\.)?\w+[-.~:/?#[\]@!$&'()*+,;=]*#?/;
const number = /^\d+$/;

module.exports.createMovieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required().pattern(number),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(link),
    trailerLink: Joi.string().required().pattern(link),
    thumbnail: Joi.string().required().pattern(link),
    movieId: Joi.string().required().pattern(number),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required()
  }),
})

module.exports.movieIdValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
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

module.exports.updateUserValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});