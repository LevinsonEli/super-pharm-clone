const mongooseObjectId = require('mongoose').Types.ObjectId;

const { CustomAPIError, NotFoundError, BadRequestError } = require('../errors');

const productsValidator = {
  id: {
    validate: function (input) {
      return mongooseObjectId.isValid(input);
    },
    errorMsg: 'Product not found',
    throwError: function () {
      throw new NotFoundError(this.errorMsg);
    },
  },
  title: {
    isRequred: true,
    maxLength: 50,
    validate: function (input) {
      if (!input || input.length > this.maxLength) return false;
      return true;
    },
    errorMsg: "'title' property must of length 1 to 50",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  price: {
    isRequred: true,
    min: 0,
    validate: function (input) {
      if (!input || input < this.min) return false;
      return true;
    },
    errorMsg: "'price' property must be positive",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  status: {
    validate: function (input) {
      if (!input) return true;
      return input == 'true' || input == 'false';
    },
    errorMsg: 'Status must true or false',
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  sort: {
    values: ['latest', 'oldest', 'latestEdit', 'oldestEdit', 'a-z', 'z-a'],
    validate: function (input) {
      if (!input) return true;
      return this.values.includes(input);
    },
    errorMsg:
      "'sort' can be one of ['latest', 'oldest', 'latestEdit', 'oldestEdit', 'a-z', 'z-a']",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  category: {
    validate: function (input) {
      if (!input)
        throw new BadRequestError('Category required');
      return mongooseObjectId.isValid(input);
    },
    errorMsg: 'Category not found',
    throwError: function () {
      throw new NotFoundError(this.errorMsg);
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
