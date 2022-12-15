const express = require('express');
const router = express.Router();

const {
    httpGetAllReviews,
    httpGetReview,
    httpCreateReview,
    httpUpdateReview,
    httpDeleteReview,
} = require('./reviews.controller');
const {
  authenticateUser,
  authorizePermissions,
} = require('../../middlewares/authentication');

router.get('/', httpGetAllReviews);
router.get('/:id', httpGetReview);
router.post('/', authenticateUser, httpCreateReview);
router.patch('/:id', httpUpdateReview);
router.delete('/:id', httpDeleteReview);

module.exports = router;