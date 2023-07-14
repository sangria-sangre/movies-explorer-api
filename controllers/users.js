const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const BadRequestError400 = require('../errors/BadRequestError400');
const ConflictError409 = require('../errors/ConflictError409');
const NotFoundError404 = require('../errors/NotFoundError404');
const { NODE_ENV, JWT_SECRET } = require('../config');

module.exports.getUser = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError404('404: Пользователь не найден.');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError404('404: Пользователь не найден.'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError400('400: Неправильные данные.'));
      } else {
        return next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError404('404: Пользователь не найден');
    }).catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError400('400: Переданы некорректные данные при создании пользователя.'));
      } else if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError404('404: Пользователь с указанным _id не найден.'));
      } else if (err.code === 11000){
        return next(new ConflictError409('409: Пользователь с указанными данными уже существует.'));
      } else {
        return next(err);
      }
    }
    );
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      userSchema.create({
        name, email,
        password: hash,
      })
        .then(() => res.status(201).send({ data: { name, email } }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError409('409: Пользователь с данным email уже был зарегестрирован.'));
          } else if (err.name === 'ValidationError') {
            return next(new BadRequestError400('400: Переданы некорректные данные при создании пользователя.'));
          } else {
            return next(err);
          }
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'L8Oe+Y9MvT7uAdcjRd6+rA',
        { expiresIn: '7d' }); //создание токена при успешной проверке данных
      res.send({ token });
    })
    .catch(next);
};