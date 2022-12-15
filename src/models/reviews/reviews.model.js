const reviewsMongo = require('./reviews.mongo');
const productsMongo = require('../products/products.mongo');
const {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
} = require('../../errors');

async function getAllReviews (productId) {
    const reviews = await reviewsMongo.find({ product: productId }).populate({ path: 'product', select: 'title' });
    return reviews;
}

async function getReview (id) {
    const review = await reviewsMongo.findOne({ _id: id });
    if (!review)
        throw new BadRequestError('Review not found');
    return review;
}

async function createReview (userId, productId, rating, comment) {
    const review = await reviewsMongo.create({ rating, comment, product: productId, user: userId });
    return review;
}

async function updateReview(id, rating, comment) {
  const updatedReview = await reviewsMongo.findOneAndUpdate(
    { _id: id },
    { rating, comment },
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedReview) 
    throw new NotFoundError('Review not found');

  return updatedReview;
}

async function deleteReview(id) {
  const deletedReview = await reviewsMongo.findOneAndDelete({ _id: id });

  if (!deletedReview) 
    throw new NotFoundError('Review not found');

  return deletedReview;
}

async function isUserhasReviewForProduct (userId, productId) {
    const review = await reviewsMongo.findOne({ user: userId, product: productId });
    return !!review;
}

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  isUserhasReviewForProduct,
};