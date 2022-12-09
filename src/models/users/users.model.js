const usersMongo = require('../users/users.mongo');
const {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
} = require('../../errors');

async function register(name, email, password, role) {
  const createdUser = await usersMongo.create({ name, email, password, role });
  return createdUser;
}

async function getUserByEmail(email) {
  return await usersMongo.findOne({ email });
}

async function isExist(email) {
  const foundUser = await usersMongo.findOne({ email });
  return !!foundUser;
}

module.exports = {
  getUserByEmail,
  isExist,
  register,
};
