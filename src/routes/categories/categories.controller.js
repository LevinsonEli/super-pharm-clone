const { StatusCodes } = require('http-status-codes');

const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../models/categories/categories.model');

async function httpGetAllCategories (req, res) {
  const categories = await getAllCategories();

  res.status(StatusCodes.OK).json(categories);
}

async function httpGetCategory (req, res) {
    const { id } = req.params;

    const category = await getCategory(id);

    res.status(StatusCodes.OK).json(category);
}

async function httpCreateCategory (req, res) {
    const { title, description, image } = req.body;

    const category = await createCategory(title, description, image);

    res.status(StatusCodes.CREATED).json(category);
}

async function httpUpdateCategory (req, res) {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const category = await updateCategory(id, title, description, image);

    res.status(StatusCodes.OK).json(category);
}

async function httpDeleteCategory (req, res) {
    const { id } = req.params;

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
