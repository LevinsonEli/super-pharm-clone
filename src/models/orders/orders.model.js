
const ordersMongo = require('./orders.mongo');
const { getProduct } = require('../products/products.model');
const {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
} = require('../../errors');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function strypeAPI ({ amount, currency }) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency
    })
    const clientSecret = paymentIntent.client_secret;
    return { clientSecret, amount };
}

async function getAllOrders() {
    const orders = await ordersMongo.find({});
    return orders;
}

async function getOrder(orderId) {
    const foundOrder = await ordersMongo.findOne({ _id: orderId });
    if (!foundOrder)
        throw new NotFoundError('Order not found');

    return foundOrder;
}

async function getUserOrders (userId) {
    const userOrders = await ordersMongo.find({ user: userId });
    return userOrders;
}

async function createOrder(userId, items, tax, shippingFee) {
    
  let orderItems = [];
  let subTotal = 0;

  for (const item of items) {
    const product = await getProduct(item.productId);
    const { title, price, image, _id } = product;
    const orderItem = {
      title,
      price,
      image,
      product: _id,
      amount: item.amount,
    };
    orderItems.push(orderItem);
    subTotal += item.amount * price;
  }

  const total = tax + shippingFee + subTotal;
  const paymentIntent = await strypeAPI({
    amount: total,
    currency: 'usd',
  });

  const order = await ordersMongo.create({
    items: orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.clientSecret,
    user: userId,
  });

  return order;
}

async function updateOrder(orderId, paymentIntentId, newStatus) {
    const updatedOrder = ordersMongo.findOneAndUpdate(
      { _id: orderId },
      { paymentIntentId, status: newStatus },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedOrder) 
        throw new NotFoundError('Order not found');

    return updatedOrder;
}

async function isExist (orderId) {
    const foundOrder = await ordersMongo.findOne({ _id: orderId });
    return !!foundOrder;
}

module.exports = {
  getAllOrders,
  getOrder,
  getUserOrders,
  createOrder,
  updateOrder,
  isExist,
};