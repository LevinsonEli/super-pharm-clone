const { StatusCodes } = require('http-status-codes');

const {
  getAllOrders,
  getOrder,
  getUserOrders,
  createOrder,
  updateOrder,
  isExist,
} = require('../../models/orders/orders.model');
const { BadRequestError } = require('../../errors');
const ordersValidator = require('../../validators/products.validator');


async function httpGetAllOrders (req, res) {
    const orders = await getAllOrders();

    res.status(StatusCodes.OK).json(orders);
}

async function httpGetOrder(req, res) {
    const { id } = req.params;
    ordersValidator.validate({ id });
    const order = await getOrder(id);
    res.status(StatusCodes.OK).json(order);
}

async function httpGetCurrentUserOrders(req, res) {
    const orders = await getUserOrders(req.user.id);
    res.status(StatusCodes.OK).json(orders);
}

async function httpCreateOrder(req, res) {
  const { items, tax, shippingFee } = req.body;
  ordersValidator.validate({ items, tax, shippingFee });

  const order = await createOrder(req.user.id, items, tax, shippingFee);

  res.status(StatusCodes.CREATED).json(order);
}

async function httpUpdateOrderStatusPaid(req, res) {
  const { id } = req.params;
  const { paymentIntentId } = req.body;
  ordersValidator.validate({ id, paymentIntentId });

  const isOrderExist = await isExist(id);
  if (!isOrderExist) throw new BadRequestError('Order does not exist');

  const updatedOrder = await updateOrder(id, paymentIntentId, 'paid');

  res.status(StatusCodes.OK).json({ success: true });
}

module.exports = {
  httpGetAllOrders,
  httpGetOrder,
  httpGetCurrentUserOrders,
  httpUpdateOrderStatusPaid,
  httpCreateOrder,
};