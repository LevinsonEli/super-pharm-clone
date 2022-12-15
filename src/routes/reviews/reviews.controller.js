const { StatusCodes } = require('http-status-codes');

const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  isUserhasReviewForProduct,
} = require('../../models/reviews/reviews.model');
const { isExist } = require('../../models/products/products.model');
const { BadRequestError }=require('../../errors/index.js');

async function httpGetAllReviews (req, res) {
    const { productId } = req.query;
    // validation
    const reviews = await getAllReviews(productId);
    res.status(StatusCodes.OK).json(reviews);
    // pagination
}

async function httpCreateReview(req, res) {
  const { productId, rating, comment } = req.body;
  // validation
  const userId = req.user.id;

  const isProductExist = await isExist(productId);
  if (!isProductExist) 
    throw new BadRequestError('Prodcut not found');
  const alreadySubmittedReview = await isUserhasReviewForProduct(
    userId,
    productId
  );
  if (alreadySubmittedReview)
    throw new BadRequestError('User has already submitted review for this product');

  const review = await createReview(userId, productId, rating, comment);

  res.status(StatusCodes.CREATED).json(review);
}

async function httpGetReview (req, res) {
  const { id } = req.params;
  // validation
  const review = await getReview(id);
  res.status(StatusCodes.OK).json(review);
}

async function httpUpdateReview (req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;
  // validation
  const review = await updateReview(id, rating, comment);

  res.status(StatusCodes.OK).json(review);
}

async function httpDeleteReview(req, res) {
  const { id } = req.params;
  // validation
  const review = await deleteReview(id);
  res.status(StatusCodes.OK).json(review);
}

module.exports = {
    httpGetAllReviews,
    httpGetReview,
    httpCreateReview,
    httpUpdateReview,
    httpDeleteReview,
}