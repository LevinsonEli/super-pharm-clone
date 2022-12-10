const jwt = require('jsonwebtoken');
const { InvalidCredentials } = require('../errors');

function createJWT (data) {
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
}

function getTokenPayload (token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log('Failed to verify token');
    console.log(err);
    throw new InvalidCredentials('Invalid Credentials');
  }
}

module.exports = {
  createJWT,
  getTokenPayload,
};