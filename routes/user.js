const userRoutes = require('express').Router();
const {getUser, updateUser} = require('../controllers/users');
const { updateUserValidate } = require('../middlewares/validator');

userRoutes.get('/me', getUser);
userRoutes.patch('/me', updateUserValidate, updateUser);

module.exports = userRoutes;