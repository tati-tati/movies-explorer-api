const router = require('express').Router();
const { createMovieJoiValidate, checkMovieIdJoiValidate } = require('../middlewares/validation');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMovies);

router.post(
  '/movies',
  createMovieJoiValidate,
  createMovie,
);

router.delete(
  '/movies/:movieId',
  checkMovieIdJoiValidate,
  deleteMovie,
);

module.exports = router;
