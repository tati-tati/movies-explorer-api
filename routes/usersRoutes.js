const router = require('express').Router();
const {
  getCurrentUser,
  // createUser,
  updateUser,
  // login,
} = require('../controllers/users');

const {
  updateUserJoiValidate,
} = require('../middlewares/validation');

// router.post('/signin', login);

// router.post('/signup', createUser);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', updateUserJoiValidate, updateUser);

module.exports = router;
