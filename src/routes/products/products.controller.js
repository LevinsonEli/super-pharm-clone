const mongooseObjectId = require('mongoose').Types.ObjectId;

const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getTotalCount,
} = require('../../models/products/products.model');
const {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
} = require('../../errors');
const productsValidator = require('../../validators/products.validator');
const paginationValidator = require('../../validators/pagination.validator');

const httpGetAllProducts = async (req, res) => {

  const { search, status, sort } = req.query;
  productsValidator.validate({ status, sort });
  let { page, limit } = req.query;
  paginationValidator.validate({ page, limit });
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const products = await getAllProducts(skip, limit, { search, status, sort });
  const productsCount = await getTotalCount({ search, status });

  res.status(200).json({ 
    data: { products },
    paging: {
      next: getNextPageUrl(req.baseUrl, productsCount, page, limit),
      previous: getPreviousPageUrl(req.baseUrl, productsCount, skip, limit),
      totalItems: productsCount,
      totalPages: Math.ceil(productsCount/limit),
      pageNumber: page, 
      pageItems: products.length
    } 
  });
};

const httpCreateProduct = async (req, res) => {
  const { title, price } = req.body;
  productsValidator.validate({ title, price });

  const createdProduct = await createProduct(title, price);
  res.status(201).json(createdProduct);
};

const httpGetProduct = async (req, res) => {

  const { id } = req.params;
  productsValidator.validate({ id });

  const foundProduct = await getProduct(id);

  res.status(200).json(foundProduct);
};

const httpUpdateProduct = async (req, res) => {

  const { id } = req.params;
  const { title, price, status } = req.body;
  productsValidator.validate({ id, title, price, status });

  const updatedProduct = await updateProduct(id, title, price, status);

  res.status(200).json(updatedProduct);
};

const httpDeleteProduct = async (req, res) => {
  const { id } = req.params;
  productsValidator.validate({ id });
  const deletedProduct = await deleteProduct(id);
  res.status(200).json(deletedProduct);
};

function getNextPageUrl(baseUrl, totalCount, page, limit) {
  if (page * (limit + 1) >= totalCount) return '';

  return `${baseUrl}?page=${page + 1}&limit=${limit}`;
}

function getPreviousPageUrl(baseUrl, totalCount, page, limit) {
  if (page <= 0 || page * (limit + 1) >= totalCount) return '';

  return `${baseUrl}?page=${page - 1}&limit=${limit}`;
}

module.exports = {
  httpGetAllProducts,
  httpCreateProduct,
  httpGetProduct,
  httpUpdateProduct,
  httpDeleteProduct,
};
