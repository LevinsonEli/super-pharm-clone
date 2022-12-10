const { CustomAPIError, NotFoundError, BadRequestError } = require('../errors');

const productsValidator = {
  page: {
    default: 1,
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
    default: 10,
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
  getValidated: function (input) {

    this.validate(input);
    const page = input.page ? Number(input.page) : this.page.default;
    const limit = input.limit ? Number(input.limit) : this.limit.default;

    return { page, limit };
  }
};

module.exports = productsValidator;
