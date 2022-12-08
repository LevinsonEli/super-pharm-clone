const express = require('express');
const router = express.Router();

const {
  httpGetAllProducts,
  httpCreateProduct,
  httpGetProduct,
  httpUpdateProduct,
  httpDeleteProduct,
} = require('./products.controller');

router.route('/')
  .get(httpGetAllProducts)
  .post(httpCreateProduct);
router
  .route('/:id')
  .get(httpGetProduct)
  .patch(httpUpdateProduct)
  .delete(httpDeleteProduct);

module.exports = router;