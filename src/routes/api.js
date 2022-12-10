const express = require('express');

const productsRouter = require('./products/products.router');
const authRouter = require('./auth/auth.router');
const usersRouter = require('./users/users.router');

const api = express.Router();

api.use('/products', productsRouter);
api.use('/auth', authRouter);
api.use('/users', usersRouter);

module.exports = api;