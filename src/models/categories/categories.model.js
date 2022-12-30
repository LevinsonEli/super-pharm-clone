const categoriesMongo = require('./categories.mongo');
const {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
} = require('../../errors');


async function getAllCategories() {
  const categories = await categoriesMongo.find({});
  return categories.filter(category => !category.parentCategory);
}

async function getCategory(id) {
  const category = await categoriesMongo.findOne({ _id: id });
  if (!category) 
    throw new BadRequestError('Category not found');

  return category;
}

async function createCategory (title, { description, thumbnailImage, descriptionImage, parentCategory }) {
  const category = await categoriesMongo.create({
    title,
    description,
    thumbnailImage,
    descriptionImage,
    parentCategory,
  });
  return category;
}

async function updateCategory (id, { title, description, thumbnailImage, descriptionImage, parentCategory }) {
  const category = await categoriesMongo.findOneAndUpdate(
    { _id: id },
    { title, description, thumbnailImage, descriptionImage, parentCategory },
    { returnDocument: 'after', runValidators: true }
  );
  if (!category)
    throw new BadRequestError('Category not found');
  return category;
}

async function deleteCategory(id) {
  const category = await categoriesMongo.findOneAndDelete({ _id: id });
  if (!category) 
    throw new BadRequestError('Category not found');
  return category;
}

async function isExist (id) {
    const foundCategory = await categoriesMongo.findOne({ _id: id });
    return !!foundCategory;
}

async function categoryCanDeriveProducts (id) {
    const foundCategory = await categoriesMongo.findOne({ _id: id });

    if (foundCategory.childCategories && foundCategory.childCategories.length > 0)
        return false;
    return true;
}

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  isExist,
  categoryCanDeriveProducts,
};