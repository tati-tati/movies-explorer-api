const { Joi, celebrate } = require('celebrate');
const validUrl = require('valid-url');

const createUserJoiValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const loginJoiValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const updateUserJoiValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const createMovieJoiValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helper) => {
      if (!validUrl.isWebUri(value)) {
        return helper.error('Введите URL');
      }
      return value;
    }),
    trailerLink: Joi.string().required().custom((value, helper) => {
      if (!validUrl.isWebUri(value)) {
        return helper.error('Введите URL');
      }
      return value;
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (!validUrl.isWebUri(value)) {
        return helper.error('Введите URL');
      }
      return value;
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const checkMovieIdJoiValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().hex().length(24)
      .required(),
  }),
});

module.exports = {
  createUserJoiValidate,
  loginJoiValidate,
  updateUserJoiValidate,
  createMovieJoiValidate,
  checkMovieIdJoiValidate,
};
