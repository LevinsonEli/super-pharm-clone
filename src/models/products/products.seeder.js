const { createProduct } = require('./products.model');
const productsMongo = require('./products.mongo');

const PRODUCTS_NUMBER = 25;
const productsTitlesList = [
  'adalimumab',
  'apixaban',
  'lenalidomide',
  'nivolumab',
  'pembrolizumab',
  'etanercept',
  'trastuzumab',
  'bevacizumab',
  'rituximab',
  'rivaroxaban',
  'aflibercept',
  'infliximab',
  'pneumococcal conjugate vaccine',
  'ustekinumab',
  'pregabalin',
];

async function seedProducts() {
  await productsMongo.deleteMany();

  for (let i = 0; i < PRODUCTS_NUMBER; i++) {
    const randomTitle = getRandomTitle();
    const randomPrice = Math.ceil(Math.random() * 999);
    await createProduct(randomTitle, randomPrice);
  }
  console.log('Products seeded');
}

function getRandomTitle() {
    const randomIndex = Math.ceil(Math.random() * productsTitlesList.length);
    return productsTitlesList[randomIndex];
}

module.exports = seedProducts;