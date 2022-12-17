const reviewsMongo = require('./reviews.mongo');
const productsMongo = require('../products/products.mongo');
const {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
} = require('../../errors');
const {
  addRatingToAvg,
  removeRatingFromAvg,
  changeRatingInAvg,
} = require('../products/statistics/statistics.model');

async function getAllReviews (productId, skip, limit) {
    const reviews = await reviewsMongo
      .find({ product: productId })
      .populate({ path: 'product', select: 'title' })
      .skip(skip)
      .limit(limit);
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
  const updatedProduct = await addRatingToAvg(productId, rating);

  return review;
}

async function updateReview(id, rating, comment) {
  const oldReview = await getReview(id);
  const updatedReview = await reviewsMongo.findOneAndUpdate(
    { _id: id },
    { rating, comment },
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedReview) 
    throw new NotFoundError('Review not found');

  if (rating) {
    const ratingChange = rating - oldReview.rating;
    const updatedProduct = await changeRatingInAvg(oldReview.product, ratingChange);
  }

  return updatedReview;
}

async function deleteReview(id) {
  const deletedReview = await reviewsMongo.findOneAndDelete({ _id: id });

  if (!deletedReview) 
    throw new NotFoundError('Review not found');

  const updatedProduct = await removeRatingFromAvg(deletedReview.product, deletedReview.rating);

  return deletedReview;
}

async function isUserhasReviewForProduct (userId, productId) {
    const review = await reviewsMongo.findOne({ user: userId, product: productId });
    return !!review;
}

async function getTotalCount (productId) {
  const result = reviewsMongo.find({ product: productId });

  return await result.countDocuments();
}

async function deleteReviewsOfProduct (productId) {
  await reviewsMongo.deleteMany({ product: productId });
  return true;
}

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  isUserhasReviewForProduct,
  getTotalCount,
  deleteReviewsOfProduct,
};