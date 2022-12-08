require('express-async-errors');

const express = require('express');

const errorHandlerMiddleware = require('./middlewares/errorHandler');
const api = require('./routes/api');

const app = express();
app.use(express.json());

app.use('/api/v1', api);

app.use(errorHandlerMiddleware);
module.exports = app;