const { ERROR_DEFAULT } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || ERROR_DEFAULT;
  const message = status === ERROR_DEFAULT ? 'Ошибка на сервере' : err.message;
  res.status(status).send({ message });
  next();
};

module.exports = errorHandler;
