const { Joi, celebrate } = require('celebrate');
const validUrl = require('valid-url');

const createUserJoiValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helper) => {
      if (!validUrl.isWebUri(value)) {
        return helper.error('Введите URL');
      }
      return value;
    }),
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

const getUserByIdJoiValidate = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex().length(24),
  }),
});

const updateUserJoiValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateUserAvatarJoiValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helper) => {
      if (!validUrl.isWebUri(value)) {
        return helper.error('Введите URL');
      }
      return value;
    }),
  }),
});

const createCardJoiValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom((value, helper) => {
      if (!validUrl.isWebUri(value)) {
        return helper.error('Введите URL');
      }
      return value;
    }),
  }),
});

const checkCardIdJoiValidate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
});

module.exports = {
  createUserJoiValidate,
  loginJoiValidate,
  getUserByIdJoiValidate,
  updateUserJoiValidate,
  updateUserAvatarJoiValidate,
  createCardJoiValidate,
  checkCardIdJoiValidate,
};
