const router = require('express').Router();
const userRoutes = require('./user');
const movieRoutes = require('./movie');
const { createUser, login} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { createUserValidate, userValidate } = require('../middlewares/validator');

router.post('/signup', createUserValidate, createUser);
router.post('/signin', userValidate, login);
router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('/*', (req, res) => {
  res.status(404).send({ message: '404: Not Found' });
});

module.exports = router;