const mongoose = require('mongoose');
const productsValidator = require('../../validators/products.validator');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [
        productsValidator.title.isRequired,
        'Product must have a title',
      ],
    },
    price: {
      type: Number,
      required: [productsValidator.price.isRequired, 'Product must have price'],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);