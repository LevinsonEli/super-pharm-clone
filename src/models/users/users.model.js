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

async function getAllUsers(skip, limit, queryObject) {
  const { sort } = queryObject;

  const filterObject = getFilterObject(queryObject);

  let result = usersMongo.find(filterObject).select('-password');

  if (sort) {
    switch (sort) {
      case 'latest':
        result = result.sort('-createdAt');
        break;
      case 'oldest':
        result = result.sort('createdAt');
        break;
      case 'latestEdit':
        result = result.sort('-updatedAt');
        break;
      case 'oldestEdit':
        result = result.sort('updatedAt');
        break;
      case 'a-z':
        result = result.sort('name');
        break;
      case 'z-a':
        result = result.sort('-name');
        break;
    }
  }

  return await result.skip(skip).limit(limit);
}

async function getUser(id) {
  const foundUser = await usersMongo.findOne({ _id: id }).select('-password');
  if (!foundUser) throw new NotFoundError('User not found');
  return foundUser;
}

async function updateUser(id, name, role) {
    console.log(id);
  const updatedUser = await usersMongo.findOneAndUpdate(
    { _id: id },
    { name, role },
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedUser) throw new NotFoundError('User not found');

  return updatedUser;
}

async function updateUserPassword(id, newPassword) {
    const user = await usersMongo.findOne({ _id: id });
    if (!user)
        throw new NotFoundError('User not found');

    user.password = newPassword;
    await user.save();

    return true;
}

async function isPasswordCorrect(id, password) {
    const user = await usersMongo.findOne({ _id: id });
    if (!user)
        throw new NotFoundError('User not found');
    
    return await user.comparePassword(password);
}

async function getTotalCount(queryObject) {
  const filterObject = getFilterObject(queryObject);
  const result = usersMongo.find(filterObject);

  return await result.countDocuments();
}

function getFilterObject(queryObject) {
  const { search } = queryObject;
  const filterObject = {};

  if (search) {
    filterObject.title = { $regex: search, $options: 'i' };
    // queryObject.description = { $regex: search, $options: 'i' }
  }

  return filterObject;
}

module.exports = {
  getUserByEmail,
  isExist,
  register,
  getAllUsers,
  getUser,
  updateUser,
  getTotalCount,
  isPasswordCorrect,
  updateUserPassword,
};
