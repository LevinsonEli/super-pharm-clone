const mongooseObjectId = require('mongoose').Types.ObjectId;

const { CustomAPIError, NotFoundError, BadRequestError } = require('../errors');

const productsValidator = {
  page: {
    validate: function (input) {
      if (input && (Number(input) != input || input <= 0)) return false;
      return true;
    },
    errorMsg: "'page' property must be a positive number",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  limit: {
    max: 50,
    validate: function (input) {
      if (input && (Number(input) != input || input <= 0 || input > this.max))
        return false;
      return true;
    },
    errorMsg: "'Limit' property must be in range (1, 50)",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  validate: function (input) {
    for (const prop in input) {
      if (Object.hasOwn(this, prop))
        if (!this[prop].validate(input[prop])) this[prop].throwError();
    }
  },
};

module.exports = productsValidator;
