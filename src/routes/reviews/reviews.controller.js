const { StatusCodes } = require('http-status-codes');

const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  isUserhasReviewForProduct,
  getTotalCount,
} = require('../../models/reviews/reviews.model');
const { isExist } = require('../../models/products/products.model');
const { BadRequestError }=require('../../errors/index.js');
const checkPermissions = require('../../utils/checkPermissions');
const reviewsValidator = require('../../validators/reviews.validator');
const paginationValidator = require('../../validators/pagination.validator');

async function httpGetAllReviews (req, res) {
  const { productId } = req.query;
  reviewsValidator.validate({ product: productId });
  const { page, limit } = paginationValidator.getValidated({
    page: req.query.page,
    limit: req.query.limit,
  });

  const skip = (page - 1) * limit;

  const reviews = await getAllReviews(productId, skip, limit);
  const reviewsCount = await getTotalCount(productId);

  res.status(200).json({
    data: { reviews },
    paging: {
      next: getNextPageUrl(req.baseUrl, reviewsCount, { page, limit }),
      previous: getPreviousPageUrl(req.baseUrl, reviewsCount, { page, limit }),
      totalItems: reviewsCount,
      totalPages: Math.ceil(reviewsCount / limit),
      pageNumber: page,
      pageItems: reviews.length,
    },
  });
}

async function httpCreateReview(req, res) {
  const { productId, rating, comment } = req.body;
  reviewsValidator.validate({ product: productId, rating, comment });
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
  reviewsValidator.validate({ id });
  const review = await getReview(id);
  res.status(StatusCodes.OK).json(review);
}

async function httpUpdateReview (req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;
  reviewsValidator.validate({ id, rating, comment });
  const review = await getReview(id);
  checkPermissions(req.user, review.user);

  const updatedReview = await updateReview(id, rating, comment);

  res.status(StatusCodes.OK).json(updatedReview);
}

async function httpDeleteReview(req, res) {
  const { id } = req.params;
  reviewsValidator.validate({ id });
  const review = await getReview(id);
  checkPermissions(req.user, review.user);
  const deletedReview = await deleteReview(id);
  res.status(StatusCodes.OK).json(deletedReview);
}

function getNextPageUrl(baseUrl, totalCount, { page, limit }) {
  let nextPageUrl = baseUrl + '?';
  if (page * (limit + 1) < totalCount)
    nextPageUrl += `&page=${page + 1}`;
  else
    return '';

  nextPageUrl += `&limit=${limit}`;

  return nextPageUrl;
}

function getPreviousPageUrl(baseUrl, totalCount, { page, limit }) {
  let previousPageUrl = baseUrl + '?';
  if (page > 0 && page * (limit + 1) < totalCount)
    previousPageUrl += `&limit=${limit}`;
  else 
    return '';

  previousPageUrl += `&page=${page + 1}`;

  return previousPageUrl;
}

module.exports = {
    httpGetAllReviews,
    httpGetReview,
    httpCreateReview,
    httpUpdateReview,
    httpDeleteReview,
}