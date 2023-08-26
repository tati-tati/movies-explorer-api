const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const CustomError = require('../utils/errors');

const { JWT_SECRET, NODE_ENV } = process.env;

const {
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_NOT_FOUND,
  ERROR_CONFLICT,
} = require('../utils/constants');

const getCurrentUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    console.log(id);
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError(ERROR_NOT_FOUND, 'Пользователь не найден');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new CustomError(ERROR_BAD_REQUEST, 'Переданы неверные данные'));
      return;
    }
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError(ERROR_NOT_FOUND, 'Пользователь не найден');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new CustomError(ERROR_BAD_REQUEST, 'Переданы неверные данные'));
      return;
    }
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    console.log(name, email, password);
    if (!name || !email || !password) {
      throw new CustomError(
        ERROR_NOT_FOUND,
        'При регистрации пользователя произошла ошибка.',
      );
    }

    const passHashed = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name, email, password: passHashed,
    });
    if (!user) {
      throw new CustomError(
        ERROR_NOT_FOUND,
        'При регистрации пользователя произошла ошибка.',
      );
    }
    res.status(201).send({
      name: user.name,
      email,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new CustomError(ERROR_CONFLICT, 'Пользователь с таким email уже существует'));
      return;
    }
    if (err.name === 'ValidationError') {
      next(
        new CustomError(
          ERROR_NOT_FOUND,
          'При регистрации пользователя произошла ошибка.',
        ),
      );
      return;
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new CustomError(
        ERROR_NOT_FOUND,
        'При обновлении профиля произошла ошибка.',
      );
    }
    res.send(user);
  } catch (err) {
    if (err.code === 11000) {
      next(new CustomError(ERROR_CONFLICT, 'Пользователь с таким email уже существует'));
      return;
    }
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(
        new CustomError(
          ERROR_BAD_REQUEST,
          'При обновлении профиля произошла ошибка.',
        ),
      );
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    const isMatched = await bcrypt.compare(password, user.password);

    if (!user || !isMatched) {
      throw new CustomError(
        ERROR_UNAUTHORIZED,
        'Вы ввели неправильный логин или пароль.',
      );
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'вжух',
      { expiresIn: '7d' },
    );
    const cookieOption = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie('jwtToken', token, cookieOption); // maxAge: 24 hours
    res.send({ message: 'Вход выполнен' });
  } catch (err) {
    next(
      new CustomError(
        ERROR_UNAUTHORIZED,
        'При авторизации произошла ошибка. Токен не передан или передан не в том формате.',
      ),
    );
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('jwtToken').send({ message: 'Выполнен выход' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCurrentUser, getUserById, createUser, updateUser, login, logout,
};
