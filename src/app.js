require('express-async-errors');

const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const errorHandlerMiddleware = require('./middlewares/errorHandler');
const notFoundMiddleware = require('./middlewares/notFound');
const api = require('./routes/api');

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('../public'));
app.use(fileUpload({ useTempFiles: true }));

app.use('/api/v1', api);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;