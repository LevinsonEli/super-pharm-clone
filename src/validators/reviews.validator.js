const mongooseObjectId = require('mongoose').Types.ObjectId;

const { CustomAPIError, NotFoundError, BadRequestError } = require('../errors');

const reviewsValidator = {
  id: {
    validate: function (input) {
      return mongooseObjectId.isValid(input);
    },
    errorMsg: 'Review not found',
    throwError: function () {
      throw new NotFoundError(this.errorMsg);
    },
  },
  rating: {
    isRequred: true,
    min: 1,
    max: 5,
    validate: function (input) {
      if (this.isRequred && !input)
        return false;
      if (Number(input) != input)
        return false;
      if (input > 5 || input < 1)
        return false;
      return true;
    },
    errorMsg: "'rating' property must a number in range (1,5)",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  comment: {
    isRequred: true,
    validate: function (input) {
      if (this.isRequred && !input)
        return false;
      return true;
    },
    errorMsg: "'comment' property must be provided",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  product: {
    validate: function (input) {
      return mongooseObjectId.isValid(input);
    },
    errorMsg: 'Product not found',
    throwError: function () {
      throw new NotFoundError(this.errorMsg);
    },
  },
  user: {
    validate: function (input) {
      return mongooseObjectId.isValid(input);
    },
    errorMsg: 'User not found',
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

module.exports = reviewsValidator;
