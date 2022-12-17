const express = require('express');
const router = express.Router();

const {
  httpGetAllCategories,
  httpCreateCategory,
  httpGetCategory,
  httpUpdateCategory,
  httpDeleteCategory,
} = require('./categories.controller');


router.route('/').get(httpGetAllCategories).post(httpCreateCategory);
router
  .route('/:id')
  .get(httpGetCategory)
  .patch(httpUpdateCategory)
  .delete(httpDeleteCategory);

module.exports = router;
