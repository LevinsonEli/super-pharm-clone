const mongooseObjectId = require('mongoose').Types.ObjectId;

const { CustomAPIError, NotFoundError, BadRequestError } = require('../errors');

const ordersValidator = {
  id: {
    validate: function (input) {
      return mongooseObjectId.isValid(input);
    },
    errorMsg: 'Order not found',
    throwError: function () {
      throw new NotFoundError(this.errorMsg);
    },
  },
  tax: {
    isRequred: true,
    validate: function (input) {
      if (this.isRequred && !input) return false;
      if (!Number.isInteger(input)) return false;
      return true;
    },
    errorMsg: "'tax' property must be integer",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  shippingFee: {
    isRequred: true,
    validate: function (input) {
      if (this.isRequred && !input) return false;
      if (!Number.isInteger(input)) return false;
      return true;
    },
    errorMsg: "'shippingFee' property must be integer",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  subTotal: {
    isRequred: true,
    validate: function (input) {
      if (this.isRequred && !input) return false;
      if (!Number.isInteger(input)) return false;
      return true;
    },
    errorMsg: "'subTotal' property must be integer",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  total: {
    isRequred: true,
    validate: function (input) {
      if (this.isRequred && !input) return false;
      if (!Number.isInteger(input)) return false;
      return true;
    },
    errorMsg: "'total' property must be integer",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  items: {
    isRequred: true,
    validate: function (input) {
      if (this.isRequred && !input) return false;
      input.map(item => {
        if (!item.product || !item.amount)
            return false;
      })
      return true;
    },
    errorMsg: "'items' property must be array of products and amounts",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
    },
  },
  status: {
    values: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
    validate: function (input) {
      return this.values.includes(input);
    },
    errorMsg: "'status' property must be one of ['pending', 'failed', 'paid', 'delivered', 'canceled']",
    throwError: function () {
      throw new BadRequestError(this.errorMsg);
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

module.exports = ordersValidator;
