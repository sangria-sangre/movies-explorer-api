const router = require('express').Router();
const {getUser, updateUser, createUser, login, getUsers} = require('../controllers/users');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const auth = require('../middlewares/auth');
const { createUserValidate, userValidate, createMovieValidate, movieIdValidate } = require('../middlewares/validator');

router.post('/signup', createUserValidate, createUser);
router.post('/signin', userValidate, login);
router.use(auth);
router.get('/users/me', getUser);
router.patch('/users/me', userValidate, updateUser);
router.get('/movies', getMovies);
router.post('/movies', createMovieValidate, createMovie);
router.delete('/movies/:movieId', movieIdValidate, deleteMovie);
router.use('/*', (req, res) => {
  res.status(404).send({ message: '404: Not Found' });
});

module.exports = router;