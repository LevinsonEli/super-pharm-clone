const express = require('express');
const router = express.Router();

const { imageUpload } = require('./images.controller');

router.post('/', imageUpload);

module.exports = router;