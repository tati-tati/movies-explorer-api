const router = require('express').Router();

const { login, createUser, logout } = require('../controllers/users');
const { loginJoiValidate, createUserJoiValidate } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const CustomError = require('../utils/errors');
const { ERROR_NOT_FOUND } = require('../utils/constants');

const userRouter = require('./usersRoutes');
const cardRouter = require('./cardsRoutes');

// роуты

router.post('/signin', loginJoiValidate, login);
router.post(
  '/signup',
  createUserJoiValidate,
  createUser,
);
router.get('/signout', logout);
router.use(auth);

router.use(userRouter);
router.use(cardRouter);
router.use(() => {
  throw new CustomError(ERROR_NOT_FOUND, 'Страница не найдена');
});

module.exports = router;
