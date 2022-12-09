const jwt = require('jsonwebtoken');

function createJWT (data) {
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
}

function isTokenValid (token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  createJWT,
  isTokenValid,
};