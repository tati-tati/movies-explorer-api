const Movie = require('../models/movie');
const CustomError = require('../utils/errors');
const {
  ERROR_BAD_REQUEST,
  ERROR_FORBIDDEN,
  ERROR_NOT_FOUND,
} = require('../utils/constants');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id }); // нужен параметр поиска фильмов?
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    // важен порядок?
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;

    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      thumbnail,
      trailerLink,
      movieId,
      owner: req.user._id,
      nameRU,
      nameEN,
    });
    console.log('сообщение из консоли с фильмом', movie);
    if (!movie) {
      throw new CustomError(ERROR_NOT_FOUND, 'Неверные данные');
    }
    res.status(201).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new CustomError(ERROR_BAD_REQUEST, 'Переданы неверные данные2'));
      return;
    }
    next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new CustomError(ERROR_NOT_FOUND, 'Нет прав на удаление!');
    }
    if (movie.owner.toString() !== req.user._id) {
      throw new CustomError(ERROR_FORBIDDEN, 'Нет прав на удаление!!');
    }
    await movie.deleteOne();
    res.send({ message: 'Фильм успешно удален!!!' });
  } catch (err) {
    next(err);
  }
};

// const putLike = async (req, res, next) => {
//   try {
//     const movie = await movie.findByIdAndUpdate(
//       req.params.cardId,
//       { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
//       { new: true },
//     );
//     if (!movie) {
//       throw new CustomError(ERROR_NOT_FOUND, 'Неверные данные');
//     }
//     res.send(movie);
//   } catch (err) {
//     if (err.name === 'CastError' || err.name === 'ValidationError') {
//       next(new CustomError(ERROR_BAD_REQUEST, 'Переданы неверные данные'));
//       return;
//     }
//     next(err);
//   }
// };

// const deleteLike = async (req, res, next) => {
//   try {
//     const movie = await movie.findByIdAndUpdate(
//       req.params.cardId,
//       { $pull: { likes: req.user._id } },
//       { new: true },
//     );
//     if (!movie) {
//       throw new CustomError(ERROR_NOT_FOUND, 'Неверные данные');
//     }
//     res.send(movie);
//   } catch (err) {
//     if (err.name === 'CastError' || err.name === 'ValidationError') {
//       next(new CustomError(ERROR_BAD_REQUEST, 'Переданы неверные данные'));
//       return;
//     }
//     next(err);
//   }
// };

module.exports = { getMovies, createMovie, deleteMovie };
