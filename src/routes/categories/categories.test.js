require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const categoriesMongo = require('../../models/categories/categories.mongo');
const productsMongo = require('../../models/products/products.mongo');

const app = require('../../app');

const DB_URI =
  process.env.MONGO_URI_TEST ||
  'mongodb://localhost:27017/super-pharm-api-test';
const API_URL = '/api/v1';

describe('Testing categories API', () => {
  const testCategory = {
    title: 'Category Title',
    description: 'Category Description',
  };
  const testCategory2 = {
    title: 'Second Category Title',
    description: 'Second Category Description',
  };

  beforeAll(async () => {
    await mongoose.connect(DB_URI);
    await categoriesMongo.deleteMany();
  }, 60000);

  afterAll(async () => {
    await categoriesMongo.deleteMany();
    await mongoose.disconnect();
  }, 60000);

  describe(`Testing POST ${API_URL}/categories`, () => {
    it(`Should respond with 201, created category`, async () => {
      await categoriesMongo.deleteMany();
      const response = await request(app)
        .post(`${API_URL}/categories`)
        .send(testCategory)
        .expect('Content-Type', /json/)
        .expect(201);
      expect(response.body.title).toBe(testCategory.title);
      expect(response.body.description).toBe(testCategory.description);
    }, 60000);

    it(`Should catch missing title`, async () => {
      const response = await request(app)
        .post(`${API_URL}/categories`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);
    }, 60000);

    it(`Should successfully create shild category`, async () => {
      await categoriesMongo.deleteMany();
      const parentCategory = await categoriesMongo.create(testCategory);
      const response = await request(app)
        .post(`${API_URL}/categories`)
        .send({ ...testCategory2, parentCategory: parentCategory._id })
        .expect('Content-Type', /json/)
        .expect(201);
    }, 60000);
  });

  describe(`Testing GET ${API_URL}/categories/:id`, () => {
    it(`Should respond with 200`, async () => {
      await categoriesMongo.deleteMany();
      const category = await categoriesMongo.create(testCategory);
      const categoryId = category._id.toString();
      const response = await request(app)
        .get(`${API_URL}/categories/${categoryId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body._id).toBe(categoryId);
      expect(response.body.title).toBe(category.title);
      expect(response.body.description).toBe(category.description);
    }, 60000);
  });

  describe(`Testing GET ${API_URL}/categories`, () => {
    it('Should respond with all categories', async () => {
      await categoriesMongo.deleteMany();
      const category1 = await categoriesMongo.create(testCategory);
      const parentCategory = await categoriesMongo.create(testCategory);
      const category2 = await categoriesMongo.create({
        ...testCategory2,
        parentCategory: parentCategory._id,
      });

      const response = await request(app)
        .get(`${API_URL}/categories`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body.length).toBe(2);
      const responseParentCategory = response.body.find(
        (item) => item._id === parentCategory._id.toString()
      );
      expect(responseParentCategory.childCategories.length).toBe(1);
      expect(responseParentCategory.childCategories[0]._id).toBe(category2._id.toString());
    }, 60000);
  });

  describe(`Testing PATCH ${API_URL}/categories/:id`, () => {
    it('Should update category', async () => {
      await categoriesMongo.deleteMany();
      const category = await categoriesMongo.create(testCategory);
      
      const response = await request(app)
        .patch(`${API_URL}/categories/${category._id.toString()}`)
        .send(testCategory2)
        .expect('Content-Type', /json/)
        .expect(200);
    expect(response.body._id).toBe(category._id.toString());
    expect(response.body.title).toBe(testCategory2.title);
    expect(response.body.description).toBe(testCategory2.description);
        
    }, 60000);
  });

  describe(`Testing DELETE ${API_URL}/categories/:id`, () => {
    it('Should respond with 200', async () => {
      const category = await categoriesMongo.create(testCategory);

      const response = await request(app)
        .delete(`${API_URL}/categories/${category._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(200);
    }, 60000);
  });
});
