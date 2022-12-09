require('express-async-errors');

const express = require('express');
const cookieParser = require('cookie-parser');

const errorHandlerMiddleware = require('./middlewares/errorHandler');
const api = require('./routes/api');

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1', api);

app.use(errorHandlerMiddleware);
module.exports = app;