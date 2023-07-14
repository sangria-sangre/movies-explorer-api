const mongoose = require('mongoose');
const validator = require('validator');
const UnauthorizedError401 = require('../errors/UnauthorizedError401');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email',
    }
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Поле "password" должно быть заполнено']
  },
  name: {
    type: String,
    default: 'name',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
},
  { versionKey: false }
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError401('401: Неправильные почта или пароль.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError401('401: Неправильные почта или пароль.'));
          }
          return user;
        });
    });
};


module.exports = mongoose.model('user', userSchema);