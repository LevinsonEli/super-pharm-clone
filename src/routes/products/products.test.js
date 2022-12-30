require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const categoriesMongo = require('../../models/categories/categories.mongo');
const productsMongo = require('../../models/products/products.mongo');

const app = require('../../app');

const DB_URI =
  process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/super-pharm-api-test';
const API_URL = '/api/v1';

describe('Testing Products API', () => {
  const testProduct = {
    title: 'Another Title',
    price: 21,
  };
  const testProduct2 = {
    title: 'Changed Title',
    price: 35,
    status: false,
  };
  const testProductWithoutTitle = {
    price: 21,
  };
  const testProductWithoutPrice = {
    title: 'Another Title',
  };
  const testProductWithoutCategory = {
    title: 'Another Title',
    price: 21,
  };
  const testProductWithInvalidCategoryId = {
    title: 'Another Title',
    price: 21,
    category: '1111',
  };
  const testProductWithIllegalCategory = {
    title: 'Another Title',
    price: 21,
  };

  let childCategory1;
  let childCategory2;
  let parentCategory;

  beforeAll(async () => {
    await mongoose.connect(DB_URI);

    await categoriesMongo.deleteMany();
    parentCategory = await categoriesMongo.create({
      title: 'Parent Category',
      description: 'Parent Description',
    });
    childCategory1 = await categoriesMongo.create({
      title: 'Child Category 1',
      description: 'Child Description 1',
      parentCategory: parentCategory._id,
    });
    childCategory2 = await categoriesMongo.create({
      title: 'Child Category 2',
      description: 'Child Description 2',
      parentCategory: parentCategory._id,
    });
    await productsMongo.deleteMany();
    testProduct.category = childCategory1._id.toString();
    testProduct2.category = childCategory2._id.toString();
    testProductWithoutTitle.category = childCategory1._id.toString();
    testProductWithoutPrice.category = childCategory1._id.toString();
    testProductWithIllegalCategory.category = parentCategory._id.toString();
  }, 60000);

  afterAll(async () => {
    await productsMongo.deleteMany();
    await categoriesMongo.deleteMany();
    await mongoose.disconnect();
  }, 60000);

  describe(`Testing POST ${API_URL}/products`, () => {
    it('It should respond with status code 201', async () => {
      const response = await request(app)
        .post(`${API_URL}/products`)
        .send(testProduct)
        .expect('Content-Type', /json/)
        .expect(201);
      expect(response.body.title).toBe(testProduct.title);
      expect(response.body.price).toBe(testProduct.price);
      expect(response.body.category).toBe(testProduct.category);
    }, 60000);

    it('It should catch missing title', async () => {
      const response = await request(app)
        .post(`${API_URL}/products`)
        .send(testProductWithoutTitle)
        .expect('Content-Type', /json/)
        .expect(400);
    }, 60000);

    it('It should catch missing price', async () => {
      const response = await request(app)
        .post(`${API_URL}/products`)
        .send(testProductWithoutPrice)
        .expect('Content-Type', /json/)
        .expect(400);
    }, 60000);

    it('It should catch missing category id', async () => {
      const response = await request(app)
        .post(`${API_URL}/products`)
        .send(testProductWithoutCategory)
        .expect('Content-Type', /json/)
        .expect(400);
    }, 60000);

    it('It should catch invalid category id', async () => {
      const response = await request(app)
        .post(`${API_URL}/products`)
        .send(testProductWithInvalidCategoryId)
        .expect('Content-Type', /json/)
        .expect(404);
    }, 60000);

    it('It should catch illegal category (category that have child categories)', async () => {
      const response = await request(app)
        .post(`${API_URL}/products`)
        .send(testProductWithIllegalCategory)
        .expect('Content-Type', /json/)
        .expect(400);
    }, 60000);
  });

  describe(`Testing GET ${API_URL}/products/:id`, () => {
    it('It should respond with status 200', async () => {
      const product = await productsMongo.create({...testProduct});
      const productId = product._id.toString();

      const getProductResponse = await request(app)
        .get(`${API_URL}/products/${productId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(getProductResponse.body.title).toBe(testProduct.title);
      expect(getProductResponse.body.price).toBe(testProduct.price);
      expect(getProductResponse.body.category).toBe(testProduct.category);
    }, 60000);
  });

  describe(`Testnig GET ${API_URL}/products`, () => {
    it('Should respond with status 200 and return correct data', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products.sort((prod1, prod2) => prod1.title.localeCompare(prod2.title));
      expect(responseProducts[0]._id).toBe(product._id.toString());
      expect(responseProducts[0].title).toBe(product.title);
      expect(responseProducts[0].description).toBe(product.description);
      expect(responseProducts[0].category._id).toBe(product.category.toString());

      expect(responseProducts[1]._id).toBe(product2._id.toString());
      expect(responseProducts[1].title).toBe(product2.title);
      expect(responseProducts[1].description).toBe(product2.description);
      expect(responseProducts[1].category._id).toBe(product2.category.toString());
    }, 60000);
    
    it('Should respond correctly for page + limit for first page', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products?page=1&limit=1`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products;
      const responsePaging = getProductsResponse.body.paging;
      expect(responseProducts.length).toBe(1);
      expect(responsePaging.next).toBe(`${API_URL}/products?page=2&limit=1`);
      expect(responsePaging.previous).toBe('');
      expect(responsePaging.totalItems).toBe(2);
      expect(responsePaging.totalPages).toBe(2);
      expect(responsePaging.pageNumber).toBe(1);
      expect(responsePaging.pageItems).toBe(1);
    }, 60000);
    
    it('Should respond correctly for page + limit for last page', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products?page=2&limit=1`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products;
      const responsePaging = getProductsResponse.body.paging;
      expect(responseProducts.length).toBe(1);
      expect(responsePaging.next).toBe('');
      expect(responsePaging.previous).toBe(`${API_URL}/products?page=1&limit=1`);
      expect(responsePaging.totalItems).toBe(2);
      expect(responsePaging.totalPages).toBe(2);
      expect(responsePaging.pageNumber).toBe(2);
      expect(responsePaging.pageItems).toBe(1);
    }, 60000);
    
    it('Should respond correctly for query sort: latest', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products?sort=latest`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products;
      expect(responseProducts[0]._id).toBe(product2._id.toString());
      expect(responseProducts[1]._id).toBe(product._id.toString());
    }, 60000);
    
    it('Should respond correctly for query sort: oldest', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products?sort=oldest`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products;
      expect(responseProducts[0]._id).toBe(product._id.toString());
      expect(responseProducts[1]._id).toBe(product2._id.toString());
    }, 60000);
    
    it('Should respond correctly for query sort: latestEdit', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });
      await productsMongo.updateOne({ _id: product._id }, testProduct2);

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products?sort=latestEdit`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products;
      expect(responseProducts[0]._id).toBe(product._id.toString());
      expect(responseProducts[1]._id).toBe(product2._id.toString());
    }, 60000);
    
    it('Should respond correctly for query sort: oldestEdit', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });
      await productsMongo.updateOne({ _id: product._id }, testProduct2);

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products?sort=oldestEdit`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products;
      expect(responseProducts[0]._id).toBe(product2._id.toString());
      expect(responseProducts[1]._id).toBe(product._id.toString());
    }, 60000);
    
    it('Should respond correctly for query sort: a-z', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products?sort=a-z`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products;
      expect(responseProducts[0]._id).toBe(product._id.toString());
      expect(responseProducts[1]._id).toBe(product2._id.toString());
    }, 60000);
    
    it('Should respond correctly for query sort: z-a', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products?sort=z-a`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products;
      expect(responseProducts[0]._id).toBe(product2._id.toString());
      expect(responseProducts[1]._id).toBe(product._id.toString());
    }, 60000);
    
    it('Should respond correctly for search query', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products?search=Another`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products;
      expect(responseProducts[0]._id).toBe(product._id.toString());
    }, 60000);
    
    it('Should respond correctly for status query', async () => {
      await productsMongo.deleteMany();
      const product = await productsMongo.create({ ...testProduct });
      const product2 = await productsMongo.create({ ...testProduct2 });
      await productsMongo.updateOne({ _id: product._id }, { status: false });

      const getProductsResponse = await request(app)
        .get(`${API_URL}/products?status=false`)
        .expect('Content-Type', /json/)
        .expect(200);
      const responseProducts = getProductsResponse.body.data.products;
      expect(responseProducts[0]._id).toBe(product._id.toString());
    }, 60000);
  });

  describe(`Testing PATCH ${API_URL}/products/:id`, () => {
    it('It should respond with status 200 and changed product', async () => {
      const product = await productsMongo.create({ ...testProduct });
      const productId = product._id.toString();

      const updateProductResponse = await request(app)
        .patch(`${API_URL}/products/${productId}`)
        .send(testProduct2)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(updateProductResponse.body.title).toBe(testProduct2.title);
      expect(updateProductResponse.body.price).toBe(testProduct2.price);
      expect(updateProductResponse.body.status).toBe(testProduct2.status);
      expect(updateProductResponse.body.category).toBe(testProduct2.category);
    }, 60000);
  });

  describe(`Testing DELETE ${API_URL}/products/:id`, () => {
    it('It should respond with status 200 and deleted product', async () => {
      const createProductResponse = await request(app)
        .post(`${API_URL}/products`)
        .send(testProduct);

      const productId = createProductResponse.body._id;

      const deleteProductResponse = await request(app)
        .delete(`${API_URL}/products/${productId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(deleteProductResponse.body.title).toBe(testProduct.title);
      expect(deleteProductResponse.body.price).toBe(testProduct.price);
      expect(deleteProductResponse.body.category).toBe(testProduct.category);
    }, 60000);
  });
});
