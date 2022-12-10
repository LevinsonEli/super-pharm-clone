const CustomAPIError = require('./CustomApiError');
const NotFoundError = require('./NotFoundError');
const BadRequestError = require('./BadRequestError');
const InvalidCredentials = require('./InvalidCredentialsError');
const UnauthorizedError = require('./UnauthorizedError');

module.exports = {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
  InvalidCredentials,
  UnauthorizedError,
};
