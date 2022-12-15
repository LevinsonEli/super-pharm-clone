const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "'rating' must be provided"],
    },
    comment: {
      type: String,
      required: [true, "'comment' must be provided"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

reviewsSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewsSchema);