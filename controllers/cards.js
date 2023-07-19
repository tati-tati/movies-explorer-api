const Card = require('../models/card');
const CustomError = require('../utils/errors');
const {
  ERROR_BAD_REQUEST,
  ERROR_FORBIDDEN,
  ERROR_NOT_FOUND,
} = require('../utils/constants');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    if (!card) {
      throw new CustomError(ERROR_NOT_FOUND, 'Неверные данные');
    }
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new CustomError(ERROR_BAD_REQUEST, 'Переданы неверные данные'));
      return;
    }
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new CustomError(ERROR_NOT_FOUND, 'Нет прав на удаление!');
    }
    if (card.owner.toString() !== req.user._id) {
      throw new CustomError(ERROR_FORBIDDEN, 'Нет прав на удаление!!');
    }
    await card.deleteOne();
    res.send({ message: 'Карточка успешно удалена!!!' });
  } catch (err) {
    next(err);
  }
};

const putLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      throw new CustomError(ERROR_NOT_FOUND, 'Неверные данные');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new CustomError(ERROR_BAD_REQUEST, 'Переданы неверные данные'));
      return;
    }
    next(err);
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new CustomError(ERROR_NOT_FOUND, 'Неверные данные');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new CustomError(ERROR_BAD_REQUEST, 'Переданы неверные данные'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getCards, createCard, deleteCard, putLike, deleteLike,
};
