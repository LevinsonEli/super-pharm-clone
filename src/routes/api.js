const express = require('express');

const productsRouter = require('./products/products.router');
const authRouter = require('./auth/auth.router');
const usersRouter = require('./users/users.router');
const categoriesRouter = require('./categories/categories.router');
const imagesRouter = require('./images/images.router');
const reviewsRouter = require('./reviews/reviews.router');

const api = express.Router();

api.use('/products', productsRouter);
api.use('/auth', authRouter);
api.use('/users', usersRouter);
api.use('/categories', categoriesRouter);
api.use('/images', imagesRouter);
api.use('/reviews', reviewsRouter);

module.exports = api;