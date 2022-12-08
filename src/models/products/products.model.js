const productsMongo = require('./products.mongo');
const {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
} = require('../../errors');

async function getAllProducts(skip, limit, queryObject) {

  const { sort } = queryObject;
  
  const filterObject = getFilterObject(queryObject);

  let result = productsMongo.find(filterObject);

  if (sort) {
    switch(sort) {
      case 'latest': result = result.sort('-createdAt'); break;
      case 'oldest': result = result.sort('createdAt');  break;
      case 'latestEdit': result = result.sort('-updatedAt'); break;
      case 'oldestEdit': result = result.sort('updatedAt'); break;
      case 'a-z': result = result.sort('title'); break;
      case 'z-a': result = result.sort('-title'); break;
    }
  }

  return await result.skip(skip).limit(limit);
}

async function createProduct (title, price) {
  return await productsMongo.create({ title, price });
}

async function getProduct (id) {
  const foundProduct = await productsMongo.findOne({ _id: id });
  if (!foundProduct)
    throw new NotFoundError('Product not found');
  return foundProduct;
}

async function updateProduct (id, title, price, status) {
  const updatedProduct = await productsMongo.findOneAndUpdate(
    { _id: id },
    { title, price, status },
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedProduct)
    throw new NotFoundError('Product not found');

  return updatedProduct;
}

async function deleteProduct (id) {
  const deletedProduct = await productsMongo.findOneAndDelete({ _id: id });

  if (!deletedProduct)
    throw new NotFoundError('Product not found');

  return deletedProduct;
}

async function getTotalCount(queryObject) {

  const filterObject = getFilterObject(queryObject);
  const result = productsMongo.find(filterObject);

  return await result.countDocuments();
}

function getFilterObject(queryObject) {

  const { search, status } = queryObject;
  const filterObject = {};

  if (search) {
    filterObject.title = { $regex: search, $options: 'i' };
    // queryObject.description = { $regex: search, $options: 'i' }
  }
  if (status) {
    filterObject.status = status;
  }

  return filterObject;
}

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getTotalCount,
};
