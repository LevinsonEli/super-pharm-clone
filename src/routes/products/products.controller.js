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
  isExist,
  categoryCanDeriveProducts,
} = require('../../models/categories/categories.model');
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
  // let { page, limit } = req.query;
  // paginationValidator.validate({ page, limit });
  // page = Number(page);
  // limit = Number(limit);
  const { page, limit } = paginationValidator.getValidated({
    page: req.query.page,
    limit: req.query.limit,
  });

  const skip = (page - 1) * limit;
console.log({ search, status, sort });
console.log({ skip, limit });
  const products = await getAllProducts(skip, limit, { search, status, sort });
  const productsCount = await getTotalCount({ search, status });
console.log(products);
  res.status(200).json({
    data: { products },
    paging: {
      next: getNextPageUrl(req.baseUrl, productsCount, { page, limit, search, status, sort, }),
      previous: getPreviousPageUrl(req.baseUrl, productsCount, { page, limit, search, status, sort, }),
      totalItems: productsCount,
      totalPages: Math.ceil(productsCount / limit),
      pageNumber: page,
      pageItems: products.length,
    },
  });
};

const httpCreateProduct = async (req, res) => {
  const { title, price, category } = req.body;
  productsValidator.validate({ title, price, category });

  const isCategoryExist = await isExist(category);
  if (!isCategoryExist) 
    throw new BadRequestError('Category not found');

  const isLegalGategory = await categoryCanDeriveProducts(category);
  if (!isLegalGategory)
    throw new BadRequestError('Cannot relate product to a parent category');

  const createdProduct = await createProduct(title, price, category);
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
  const { title, price, status, category } = req.body;
  productsValidator.validate({ id, title, price, status, category });

  const isCategoryExist = await isExist(category);
  if (!isCategoryExist) throw new BadRequestError('Category not found');

  const isLegalGategory = await categoryCanDeriveProducts(category);
  if (!isLegalGategory)
    throw new BadRequestError('Cannot relate product to a parent category');

  const updatedProduct = await updateProduct(id, title, price, status, category);

  res.status(200).json(updatedProduct);
};

const httpDeleteProduct = async (req, res) => {
  const { id } = req.params;
  productsValidator.validate({ id });
  const deletedProduct = await deleteProduct(id);
  res.status(200).json(deletedProduct);
};

function getNextPageUrl(baseUrl, totalCount, { page, limit, search, status, sort }) {
  let nextPageUrl = baseUrl + '?';
  if (page * limit < totalCount)
    nextPageUrl += `page=${page + 1}`;
  else
    return '';

  nextPageUrl += `&limit=${limit}`;

  if (search)
    nextPageUrl += `&search=${search}`;
  if (status)
    nextPageUrl += `&status=${status}`;
  if (sort)
    nextPageUrl += `&sort=${sort}`;

  return nextPageUrl;
}

function getPreviousPageUrl(baseUrl, totalCount, { page, limit, search, status, sort }) {
  let previousPageUrl = baseUrl + '?';
  
  if (page > 1 && page * limit <= totalCount)
    previousPageUrl += `page=${page - 1}`;
  else
    return '';

  previousPageUrl += `&limit=${limit}`;

  if (search) 
    previousPageUrl += `&search=${search}`;
  if (status) 
    previousPageUrl += `&status=${status}`;
  if (sort) 
    previousPageUrl += `&sort=${sort}`;

  return previousPageUrl;
}

module.exports = {
  httpGetAllProducts,
  httpCreateProduct,
  httpGetProduct,
  httpUpdateProduct,
  httpDeleteProduct,
};
