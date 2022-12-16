const { StatusCodes } = require('http-status-codes');

const {
  CustomAPIError
} = require('../errors');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (!(err instanceof CustomAPIError))
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Not found' });
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
