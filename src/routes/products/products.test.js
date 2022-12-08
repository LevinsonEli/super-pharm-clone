require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../app');

const DB_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/super-pharm-api';
const API_URL = '/api/v1';

describe('Testing Products API', () => {
  let productId;

  beforeAll((done) => {
    mongoose.connect(DB_URI, done);
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });

  describe(`Testing POST ${API_URL}/products`, () => {

    it('It should create a product', async () => {
      const response = await request(app)
        .post(`${API_URL}/products`)
        .send({ title: 'Another Title', price: '21' })
        .expect('Content-Type', /json/)
        .expect(201);
      expect(response.body.title).toBe('Another Title');
      expect(response.body.price).toBe(21);

      const product = await request(app)
        .get(`${API_URL}/products/${response.body._id}`);
      expect(product.body.title).toBe('Another Title');
      expect(product.body.price).toBe(21);
      productId = product.body._id;
    });

    it('It should catch missing title', async () => {
      const response = await request(app)
        .post(`${API_URL}/products`)
        .send({ price: '21' })
        .expect('Content-Type', /json/)
        // .expect(400);
      
      // expect(response.body).toBe({
      //   error: 'Title property required'
      // })
    })

    it('It should catch missing price', async () => {
      const response = await request(app)
        .post(`${API_URL}/products`)
        .send({ title: 'New Title' })
        .expect('Content-Type', /json/);
      // .expect(400);

      // expect(response.body).toBe({
      //   error: 'Title property required'
      // })
    });
  })

  describe(`Testing GET ${API_URL}/products`, () => {
    it('It should respond with 200 success', async () => {
      await request(app)
        .get(`${API_URL}/products`)
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe(`Testing POST ${API_URL}/products/:id`, () => {
    it('It should update the product', async () => {
      const response = await request(app)
        .patch(`${API_URL}/products/${productId}`)
        .send({ title: 'Updated', price: '17' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.title).toBe('Updated');
      expect(response.body.price).toBe(17);

      const product = await request(app).get(
        `${API_URL}/products/${productId}`
      );
      expect(product.body.title).toBe('Updated');
      expect(product.body.price).toBe(17);
    })

    it('It should respond with error on invalid id', async () => {
      const response = await request(app)
        .patch(`${API_URL}/products/invalid_id`)
        .send({ title: 'Updated', price: '17' })
        // .expect('Content-Type', /json/)
        // .expect(200);
    })
    
    it('It should respond with error on unexisting product', async () => {
      const response = await request(app)
        .patch(`${API_URL}/products/638dea68c2c953ccd0a29c33`)
        .send({ title: 'Updated', price: '17' });
      // .expect('Content-Type', /json/)
      // .expect(200);
    });
  })

  describe(`Testing DELETE ${API_URL}/products/:id`, () => {
    it('It should delete an existing product', async () => {
      const createResponse = await request(app)
        .patch(`${API_URL}/products/${productId}`)
        .send({ title: 'Updated', price: '17' })
        .expect('Content-Type', /json/)
        .expect(200);
      
      const deleteResponse = await request(app)
        .delete(`${API_URL}/products/${createResponse.body._id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(createResponse.body.title).toBe(deleteResponse.body.title);
      expect(createResponse.body.price).toBe(deleteResponse.body.price);
      expect(createResponse.body._id).toBe(deleteResponse.body._id);
    })
  })
});
