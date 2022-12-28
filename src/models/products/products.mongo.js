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
    numOfReviews: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
  },
  { 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

module.exports = mongoose.model('Product', productSchema);