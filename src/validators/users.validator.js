const mongooseObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');

const { CustomAPIError, NotFoundError, BadRequestError } = require('../errors');

const productsValidator = {
  id: {
    validate: function (input) {
      return mongooseObjectId.isValid(input);
    },
    errorMsg: 'User not found',
    throwError: function () {
      throw new NotFoundError(this.errorMsg);
    },
  },
  name: {
    isRequred: true,
    minLength: 3,
    maxLength: 25,
    validate: function (input) {
      if (!input && this.isRequred) return false;
      if (input.length < this.minLength || input.length > this.maxLength)
        return false;
      return true;
    },
    errorMsg: "'name' property must of length 3 to 25",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  email: {
    isRequred: true,
    validate: function (input) {
      if (!input && this.isRequred) return false;
      if (!validator.isEmail(input)) return false;
      return true;
    },
    errorMsg: "'email' property must be valid email",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  password: {
    isRequred: true,
    validate: function (input) {
      //   if (!input && this.isRequred) return false;
      //   if (!validator.isEmail(input)) return false;
      //   return true;
    },
    errorMsg: "'email' property must be valid email",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  role: {
    values: [ 'admin', 'user' ],
    default: 'user',
    validate: function (input) {
        if (input && !this.values.includes(input))
          return false;
        return true;
    },
    errorMsg: "'role' property must be one of ['admin', 'user']",
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
