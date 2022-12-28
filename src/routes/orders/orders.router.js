const express = require('express');
const router = express.Router();


const {
  httpGetAllOrders,
  httpGetOrder,
  httpGetCurrentUserOrders,
  httpUpdateOrderStatusPaid,
  httpCreateOrder,
} = require('./orders.controller');
const {
    authenticateUser,
    authorizePermissions,
} = require('../../middlewares/authentication');

router.get('/', httpGetAllOrders);
router.get('/show_my_orders', authenticateUser, httpGetCurrentUserOrders);
router.get('/:id', httpGetOrder);
router.patch('/:id', httpUpdateOrderStatusPaid);
router.post('/', authenticateUser, httpCreateOrder);

module.exports = router;