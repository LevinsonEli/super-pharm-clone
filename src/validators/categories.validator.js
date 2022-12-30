const mongooseObjectId = require('mongoose').Types.ObjectId;

const { CustomAPIError, NotFoundError, BadRequestError } = require('../errors');

const categoriesValidator = {
  id: {
    validate: function (input) {
      return mongooseObjectId.isValid(input);
    },
    errorMsg: 'Category not found',
    throwError: function () {
      throw new NotFoundError(this.errorMsg);
    },
  },
  title: {
    isRequred: true,
    validate: function (input) {
      if (this.isRequred && !input) return false;
      return true;
    },
    errorMsg: "'title' property must be provided",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  parentCategory: {
    validate: function (input) {
      if (!input) return true;
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

module.exports = categoriesValidator;
