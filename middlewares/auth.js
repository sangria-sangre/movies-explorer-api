const jwt = require('jsonwebtoken');
const UnauthorizedError401 = require('../errors/UnauthorizedError401');
const { NODE_ENV, JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError401('Необходима авторизация.'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    jwtToken = NODE_ENV === 'production' ? JWT_SECRET : 'L8Oe+Y9MvT7uAdcjRd6+rA';
    payload = jwt.verify(token,  jwtToken);
  } catch (err) {
    return next(new UnauthorizedError401('Необходима авторизация.'));
  }

  req.user = payload;

  next();
};