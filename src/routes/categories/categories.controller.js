const { StatusCodes } = require('http-status-codes');

const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../models/categories/categories.model');
const categoriesValidator = require('../../validators/categories.validator');


async function httpGetAllCategories (req, res) {
  const categories = await getAllCategories();

  res.status(StatusCodes.OK).json(categories);
}

async function httpGetCategory (req, res) {
  const { id } = req.params;
  categoriesValidator.validate({ id });

  const category = await getCategory(id);

  res.status(StatusCodes.OK).json(category);
}

async function httpCreateCategory (req, res) {
  const { title, description, thumbnailImage, descriptionImage, parentCategory } = req.body;
  categoriesValidator.validate({ title, description, thumbnailImage, descriptionImage, parentCategory });

  const category = await createCategory(title, { description, thumbnailImage, descriptionImage, parentCategory });

  res.status(StatusCodes.CREATED).json(category);
}

async function httpUpdateCategory (req, res) {
  const { id } = req.params;
  const { title, description, thumbnailImage, descriptionImage, parentCategory } = req.body;
  categoriesValidator.validate({ id, title, description, thumbnailImage, descriptionImage, parentCategory });

  const category = await updateCategory(id, { title, description, thumbnailImage, descriptionImage, parentCategory });

  res.status(StatusCodes.OK).json(category);
}

async function httpDeleteCategory (req, res) {
  const { id } = req.params;
  categoriesValidator.validate({ id });

  const category = await deleteCategory(id);

  res.status(StatusCodes.OK).json(category);
}

module.exports = {
  httpGetAllCategories,
  httpGetCategory,
  httpCreateCategory,
  httpUpdateCategory,
  httpDeleteCategory,
};
