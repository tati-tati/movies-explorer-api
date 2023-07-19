const router = require('express').Router();
const { createCardJoiValidate, checkCardIdJoiValidate } = require('../middlewares/validation');

const {
  getCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCardJoiValidate, createCard);

router.delete('/cards/:cardId', checkCardIdJoiValidate, deleteCard);

router.put('/cards/:cardId/likes', checkCardIdJoiValidate, putLike);

router.delete('/cards/:cardId/likes', checkCardIdJoiValidate, deleteLike);

module.exports = router;
