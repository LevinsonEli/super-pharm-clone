const express = require('express');

const productsRouter = require('./products/products.router');
const authRouter = require('./auth/auth.router');

const api = express.Router();

api.use('/products', productsRouter);
api.use('/auth', authRouter);

module.exports = api;