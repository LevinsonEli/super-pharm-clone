const productsMongo = require('../products.mongo');

async function addRatingToAvg(productId, rating) {
  const product = await productsMongo.findOne({ _id: productId });
  if (!product) throw new NotFoundError('Product not found');

  const numOfReviews = product.numOfReviews + 1;
  const avgRating =
    (product.avgRating * product.numOfReviews + rating) / numOfReviews;
  const updatedProduct = await productsMongo.findOneAndUpdate(
    { _id: productId },
    { numOfReviews, avgRating },
    { returnDocument: 'after', runValidators: true }
  );

  return updatedProduct;
}

async function removeRatingFromAvg(productId, rating) {
  const product = await productsMongo.findOne({ _id: productId });
  if (!product) throw new NotFoundError('Product not found');

  const numOfReviews = product.numOfReviews - 1;
  const avgRating =
    (product.avgRating * product.numOfReviews - rating) / numOfReviews;
  const updatedProduct = await productsMongo.findOneAndUpdate(
    { _id: productId },
    { numOfReviews, avgRating },
    { returnDocument: 'after', runValidators: true }
  );

  return updatedProduct;
}

async function changeRatingInAvg(productId, ratingChange) {
  const product = await productsMongo.findOne({ _id: productId });
  if (!product) throw new NotFoundError('Product not found');

  const avgRating =
    (product.avgRating * product.numOfReviews + ratingChange) /
    product.numOfReviews;
  const updatedProduct = await productsMongo.findOneAndUpdate(
    { _id: productId },
    { avgRating },
    { returnDocument: 'after', runValidators: true }
  );

  return updatedProduct;
}

module.exports = {
  addRatingToAvg,
  removeRatingFromAvg,
  changeRatingInAvg,
};
